import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// ============================================================
// CONFIGURAÇÃO DA API
// ============================================================

// Android Emulator
// 10.0.2.2 aponta para o localhost do computador.
//
// Se estiver usando Expo Go em um celular físico,
// troque pelo IP local do seu computador.
//
// Exemplo:
// const API_BASE_URL = 'http://192.168.0.10:8000';

const API_BASE_URL =
  Platform.OS === 'android'
    ? 'https://mobilebackend-hjyr.onrender.com'
    : 'https://mobilebackend-hjyr.onrender.com';

// ============================================================
// CORES
// ============================================================

const FORD_COLORS = {
  bluePrimary: '#003478',
  blueDark: '#001A3F',
  chrome: '#D1D5DB',
  bgLight: '#F3F4F6',
  white: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  raptorRed: '#E51937',
};

// ============================================================
// BATTLE CARDS
// ============================================================

const BATTLE_CARDS = [
  {
    id: '1',
    icone: 'shield-check',
    titulo: 'OBJEÇÃO HILUX',
    prompt:
      'O cliente diz que a Hilux não quebra e tem melhor valor de revenda. Dê uma resposta curta e matadora (Battle Card) de 3 linhas mostrando por que a engenharia e chassi da Ranger atual são superiores.',
  },
  {
    id: '2',
    icone: 'cash',
    titulo: 'PREÇO ALTO',
    prompt:
      'O cliente acha a Raptor (R$ 499 mil) muito cara. Dê 3 argumentos curtos focados nos Amortecedores Fox, motor V6 Bi-Turbo e exclusividade para provar que ela vale cada centavo.',
  },
  {
    id: '3',
    icone: 'engine',
    titulo: 'DUELO V6',
    prompt:
      'Compare o desempenho do V6 Bi-Turbo da Raptor com os V6 e Turbo diesel da Amarok e S10. Foque na cavalaria e aceleração de forma direta.',
  },
];

// ============================================================
// COMPONENTE
// ============================================================

export default function CopilotoScreen() {
  const [mensagens, setMensagens] = useState([
    {
      id: '0',
      role: 'assistant',
      text:
        'SISTEMA INICIADO. Selecione um Battle Card ou insira a objeção tática de vendas.',
    },
  ]);

  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);

  const flatListRef = useRef(null);

  // ==========================================================
  // NOME DO USUÁRIO
  // ==========================================================

  useFocusEffect(
    useCallback(() => {
      const checarNome = async () => {
        try {
          const nomeSalvo = await AsyncStorage.getItem('nome_usuario');

          const nomeAtual = nomeSalvo
            ? nomeSalvo.toUpperCase()
            : 'ANALISTA';

          setMensagens(prev =>
            prev.map(msg =>
              msg.id === '0'
                ? {
                    ...msg,
                    text: `SISTEMA INICIADO, ${nomeAtual}. Selecione um Battle Card ou insira a objeção tática de vendas.`,
                  }
                : msg
            )
          );
        } catch (error) {
          console.log('Erro ao carregar nome:', error);
        }
      };

      checarNome();
    }, [])
  );

  // ==========================================================
  // COPILOTO
  // ==========================================================

  const enviarMensagem = async textoUsuario => {
    const texto = textoUsuario.trim();

    if (!texto) return;

    const novaMensagem = {
      id: Date.now().toString(),
      role: 'user',
      text: texto,
    };

    setMensagens(prev => [...prev, novaMensagem]);
    setInput('');
    setCarregando(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);

    try {
      // ======================================================
      // CHAMADA PARA A FASTAPI
      // ======================================================

      const resposta = await fetch(
        `${API_BASE_URL}/api/v1/copiloto`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            mensagem: texto,
          }),
        }
      );

      // ======================================================
      // TRATAMENTO DO STATUS HTTP
      // ======================================================

      const dados = await resposta.json();

      if (!resposta.ok) {
        const mensagemErro =
          dados?.detail ||
          `Erro HTTP ${resposta.status}`;

        throw new Error(mensagemErro);
      }

      // ======================================================
      // RESPOSTA DA API
      // ======================================================

      const textoResposta =
        dados?.resposta ||
        dados?.veredito ||
        dados?.message;

      if (!textoResposta) {
        throw new Error(
          'A API retornou uma resposta vazia.'
        );
      }

      setMensagens(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: textoResposta,
        },
      ]);
    } catch (error) {
      console.error(
        'Erro no Copiloto:',
        error
      );

      let mensagemErro =
        'ERRO DE CONEXÃO COM O SERVIDOR.';

      if (
        error?.message?.includes(
          'Network request failed'
        )
      ) {
        mensagemErro =
          'NÃO FOI POSSÍVEL CONECTAR À API. VERIFIQUE SE O FASTAPI ESTÁ RODANDO E SE A URL DA API ESTÁ CORRETA.';
      } else if (error?.message) {
        mensagemErro =
          `ERRO NA API: ${error.message}`;
      }

      setMensagens(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: mensagemErro,
        },
      ]);
    } finally {
      setCarregando(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    }
  };

  // ==========================================================
  // RENDER MENSAGEM
  // ==========================================================

  const renderMensagem = ({ item }) => {
    const isUser = item.role === 'user';

    return (
      <View
        style={[
          styles.balaoWrapper,
          isUser
            ? styles.balaoUserWrapper
            : styles.balaoIAWrapper,
        ]}
      >
        {!isUser && (
          <View style={styles.iconeIA}>
            <MaterialCommunityIcons
              name="robot"
              size={16}
              color={FORD_COLORS.white}
            />
          </View>
        )}

        <View
          style={[
            styles.balao,
            isUser
              ? styles.balaoUser
              : styles.balaoIA,
          ]}
        >
          <Text
            style={[
              styles.textoBalao,
              isUser
                ? styles.textoUser
                : styles.textoIA,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  // ==========================================================
  // INTERFACE
  // ==========================================================

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerIconBg}>
            <MaterialCommunityIcons
              name="message-processing"
              size={24}
              color={FORD_COLORS.white}
            />
          </View>

          <View>
            <Text style={styles.headerTitulo}>
              COPILOTO IA
            </Text>

            <Text style={styles.headerSub}>
              ASSISTENTE TÁTICO DE VENDAS
            </Text>
          </View>
        </View>

        {/* BATTLE CARDS */}

        <View
          style={styles.battleCardsContainer}
        >
          <Text
            style={styles.battleCardsTitulo}
          >
            BATTLE CARDS (RESPOSTA RÁPIDA)
          </Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={BATTLE_CARDS}
            keyExtractor={item => item.id}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cardRapido}
                onPress={() =>
                  enviarMensagem(item.prompt)
                }
                disabled={carregando}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={item.icone}
                  size={14}
                  color={FORD_COLORS.white}
                  style={{
                    marginRight: 6,
                  }}
                />

                <Text
                  style={
                    styles.cardRapidoTexto
                  }
                >
                  {item.titulo}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* CHAT */}

        <FlatList
          ref={flatListRef}
          data={mensagens}
          keyExtractor={item => item.id}
          renderItem={renderMensagem}
          contentContainerStyle={
            styles.chatContainer
          }
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({
              animated: true,
            })
          }
          ListFooterComponent={() =>
            carregando ? (
              <View
                style={[
                  styles.balaoWrapper,
                  styles.balaoIAWrapper,
                  {
                    marginTop: 8,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconeIA,
                    {
                      backgroundColor:
                        FORD_COLORS.chrome,
                    },
                  ]}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={16}
                    color={FORD_COLORS.white}
                  />
                </View>

                <View
                  style={[
                    styles.balao,
                    styles.balaoIALoading,
                  ]}
                >
                  <ActivityIndicator
                    size="small"
                    color={FORD_COLORS.blueDark}
                  />

                  <Text
                    style={
                      styles.textoIALoading
                    }
                  >
                    PROCESSANDO TÁTICA...
                  </Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* INPUT */}

        <View style={styles.inputWrapper}>
          <View
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              placeholder="INSERIR OBJEÇÃO..."
              placeholderTextColor={
                FORD_COLORS.textSecondary
              }
              value={input}
              onChangeText={setInput}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.botaoEnviar,
                !input.trim() &&
                  styles.botaoEnviarDesativado,
              ]}
              onPress={() =>
                enviarMensagem(input)
              }
              disabled={
                carregando ||
                !input.trim()
              }
              activeOpacity={0.9}
            >
              <MaterialCommunityIcons
                name="send"
                size={18}
                color={FORD_COLORS.white}
                style={{
                  marginLeft: 2,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FORD_COLORS.bgLight,
  },

  header: {
    flexDirection: 'row',
    backgroundColor: FORD_COLORS.blueDark,
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor:
      FORD_COLORS.bluePrimary,
    elevation: 4,
    zIndex: 10,
  },

  headerIconBg: {
    backgroundColor:
      'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 4,
    marginRight: 16,
  },

  headerTitulo: {
    fontSize: 18,
    fontWeight: '900',
    color: FORD_COLORS.white,
    letterSpacing: 1,
  },

  headerSub: {
    fontSize: 10,
    color: FORD_COLORS.chrome,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },

  battleCardsContainer: {
    paddingVertical: 16,
    backgroundColor: FORD_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor:
      FORD_COLORS.chrome,
  },

  battleCardsTitulo: {
    fontSize: 10,
    fontWeight: '900',
    color: FORD_COLORS.textSecondary,
    marginBottom: 12,
    paddingHorizontal: 20,
    letterSpacing: 1,
  },

  cardRapido: {
    flexDirection: 'row',
    backgroundColor: FORD_COLORS.blueDark,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    elevation: 2,
  },

  cardRapidoTexto: {
    fontSize: 11,
    fontWeight: '900',
    color: FORD_COLORS.white,
    letterSpacing: 0.5,
  },

  chatContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },

  balaoWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },

  balaoUserWrapper: {
    justifyContent: 'flex-end',
  },

  balaoIAWrapper: {
    justifyContent: 'flex-start',
  },

  iconeIA: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor:
      FORD_COLORS.bluePrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 2,
  },

  balao: {
    maxWidth: '82%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 4,
    elevation: 1,
  },

  balaoUser: {
    backgroundColor:
      FORD_COLORS.bluePrimary,
    borderBottomRightRadius: 0,
  },

  balaoIA: {
    backgroundColor: FORD_COLORS.white,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor:
      FORD_COLORS.chrome,
  },

  textoBalao: {
    fontSize: 13,
    lineHeight: 20,
  },

  textoUser: {
    color: FORD_COLORS.white,
    fontWeight: '600',
  },

  textoIA: {
    color: FORD_COLORS.textPrimary,
    fontWeight: '600',
  },

  balaoIALoading: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      FORD_COLORS.white,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor:
      FORD_COLORS.chrome,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  textoIALoading: {
    fontSize: 11,
    color: FORD_COLORS.blueDark,
    fontWeight: '900',
    marginLeft: 8,
    letterSpacing: 0.5,
  },

  inputWrapper: {
    backgroundColor: FORD_COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor:
      FORD_COLORS.chrome,
    elevation: 10,
  },

  inputContainer: {
    flexDirection: 'row',
    backgroundColor:
      FORD_COLORS.bgLight,
    borderRadius: 4,
    borderWidth: 1,
    borderColor:
      FORD_COLORS.chrome,
    alignItems: 'center',
    paddingRight: 6,
  },

  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 12,
    color: FORD_COLORS.textPrimary,
    maxHeight: 120,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  botaoEnviar: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor:
      FORD_COLORS.raptorRed,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  botaoEnviarDesativado: {
    backgroundColor:
      FORD_COLORS.chrome,
    elevation: 0,
  },
});