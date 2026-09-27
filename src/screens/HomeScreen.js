import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// ============================================================
// PALETA EXECUTIVA "FORD PERFORMANCE"
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

export default function HomeScreen({ navigation }) {
  const [fotoUri, setFotoUri] = useState(null);
  const [nome, setNome] = useState('Gabriel');
  const [historicoRecente, setHistoricoRecente] = useState([]);

  // ==========================================================
  // CARREGAMENTO
  // ==========================================================

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    try {
      const [
        fotoSalva,
        nomeSalvo,
        historicoSalvo,
      ] = await Promise.all([
        AsyncStorage.getItem('foto_usuario'),
        AsyncStorage.getItem('nome_usuario'),
        AsyncStorage.getItem('historico_pesquisas'),
      ]);

      // ------------------------------------------------------
      // FOTO
      // ------------------------------------------------------

      if (fotoSalva) {
        setFotoUri(fotoSalva);
      } else {
        setFotoUri(null);
      }

      // ------------------------------------------------------
      // NOME
      // ------------------------------------------------------

      if (nomeSalvo?.trim()) {
        setNome(nomeSalvo);
      } else {
        setNome('Gabriel');
      }

      // ------------------------------------------------------
      // HISTÓRICO
      // ------------------------------------------------------

      if (!historicoSalvo) {
        setHistoricoRecente([]);
        return;
      }

      const arrayHistorico = JSON.parse(
        historicoSalvo
      );

      if (Array.isArray(arrayHistorico)) {
        setHistoricoRecente(
          arrayHistorico.slice(0, 3)
        );
      } else {
        setHistoricoRecente([]);
      }
    } catch (error) {
      console.error(
        'Erro ao carregar dados da Home:',
        error
      );

      setHistoricoRecente([]);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={FORD_COLORS.blueDark}
      />

      {/* ====================================================
          FUNDO ESCURO EXECUTIVO
      ===================================================== */}

      <View style={styles.headerBackground} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContainer
        }
      >
        {/* ==================================================
            LOGO
        =================================================== */}

        <View style={styles.topBrandingContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.fordLogoHeader}
            resizeMode="contain"
          />
        </View>

        {/* ==================================================
            CABEÇALHO
        =================================================== */}

        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.saudacao}>
              PAINEL DE CONTROLE
            </Text>

            <Text
              style={styles.nomeUsuario}
              numberOfLines={1}
            >
              BEM-VINDO,{' '}
              {(nome || 'Gabriel').toUpperCase()}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Perfil')
            }
            activeOpacity={0.8}
          >
            {fotoUri ? (
              <Image
                source={{ uri: fotoUri }}
                style={styles.avatarPequeno}
              />
            ) : (
              <View
                style={styles.avatarPlaceholder}
              >
                <Ionicons
                  name="person"
                  size={20}
                  color={FORD_COLORS.white}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ==================================================
            HERO / NOVA VARREDURA
        =================================================== */}

        <View style={styles.heroCard}>
          <View
            style={styles.heroBadgeContainer}
          >
            <Ionicons
              name="hardware-chip"
              size={14}
              color={FORD_COLORS.raptorRed}
              style={{ marginRight: 6 }}
            />

            <Text style={styles.heroBadge}>
              MOTOR DE INTELIGÊNCIA ATIVO
            </Text>
          </View>

          <Text style={styles.heroTitulo}>
            NOVA VARREDURA DE MERCADO
          </Text>

          <Text style={styles.heroSub}>
            Extraia dados técnicos e gere
            relatórios táticos de concorrência
            em segundos.
          </Text>

          <TouchableOpacity
            style={styles.heroBotao}
            onPress={() =>
              navigation.navigate('Pesquisa')
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name="scan"
              size={18}
              color={FORD_COLORS.white}
              style={{ marginRight: 8 }}
            />

            <Text style={styles.heroBotaoTexto}>
              INICIAR MAPEAMENTO
            </Text>
          </TouchableOpacity>
        </View>

        {/* ==================================================
            FERRAMENTAS RÁPIDAS
        =================================================== */}

        <Text style={styles.sectionTitle}>
          FERRAMENTAS RÁPIDAS
        </Text>

        <View style={styles.rowAtalhos}>
          {/* COFRE */}

          <TouchableOpacity
            style={styles.atalhoCard}
            onPress={() =>
              navigation.navigate('Perfil')
            }
            activeOpacity={0.8}
          >
            <View style={styles.atalhoIconeBg}>
              <Ionicons
                name="server-outline"
                size={24}
                color={FORD_COLORS.bluePrimary}
              />
            </View>

            <View style={styles.atalhoTexto}>
              <Text style={styles.atalhoTitulo}>
                COFRE
              </Text>

              <Text style={styles.atalhoSub}>
                Acessar Histórico
              </Text>
            </View>
          </TouchableOpacity>

          {/* COPILOTO */}

          <TouchableOpacity
            style={styles.atalhoCard}
            onPress={() =>
              navigation.navigate('Copiloto')
            }
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.atalhoIconeBg,
                {
                  borderColor:
                    FORD_COLORS.raptorRed,
                },
              ]}
            >
              <Ionicons
                name="chatbubbles-outline"
                size={24}
                color={FORD_COLORS.raptorRed}
              />
            </View>

            <View style={styles.atalhoTexto}>
              <Text style={styles.atalhoTitulo}>
                COPILOTO
              </Text>

              <Text style={styles.atalhoSub}>
                Argumentação IA
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ==================================================
            ATIVIDADE RECENTE
        =================================================== */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            REGISTROS RECENTES
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Perfil')
            }
          >
            <Text style={styles.verTodos}>
              VER TODOS
            </Text>
          </TouchableOpacity>
        </View>

        {/* ==================================================
            HISTÓRICO
        =================================================== */}

        {historicoRecente.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.historicoScroll
            }
          >
            {historicoRecente.map(
              (item, index) => {
                const id =
                  item?.id ||
                  `historico-${index}`;

                const nomeVeiculo =
                  item?.alvoNome ||
                  'VEÍCULO';

                const data =
                  item?.data || '';

                const dataFormatada =
                  data.split?.(' ')?.[0] ||
                  '--/--/----';

                return (
                  <TouchableOpacity
                    key={id}
                    style={
                      styles.cardHistoricoMin
                    }
                    onPress={() =>
                      navigation.navigate(
                        'Perfil'
                      )
                    }
                    activeOpacity={0.8}
                  >
                    {/* DATA / DUELO */}

                    <View
                      style={
                        styles.historicoHeaderTop
                      }
                    >
                      <Text
                        style={
                          styles.dataTextoMin
                        }
                      >
                        {dataFormatada}
                      </Text>

                      {item?.comparouRaptor && (
                        <Ionicons
                          name="flash"
                          size={14}
                          color={
                            FORD_COLORS.raptorRed
                          }
                        />
                      )}
                    </View>

                    {/* VEÍCULO */}

                    <Text
                      style={
                        styles.nomeVeiculoMin
                      }
                      numberOfLines={2}
                    >
                      {nomeVeiculo.toUpperCase()}
                    </Text>

                    {/* TAG */}

                    <View
                      style={
                        styles.historicoFooterTag
                      }
                    >
                      <Text
                        style={
                          styles.historicoTagTexto
                        }
                      >
                        {item?.comparouRaptor
                          ? 'DUELO ESTRATÉGICO'
                          : 'DADOS BRUTOS'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            )}
          </ScrollView>
        ) : (
          <View
            style={styles.emptyHistorico}
          >
            <Ionicons
              name="folder-open-outline"
              size={28}
              color={FORD_COLORS.chrome}
              style={{ marginBottom: 8 }}
            />

            <Text style={styles.emptyTexto}>
              O BANCO DE DADOS ESTÁ VAZIO.
            </Text>

            <Text
              style={styles.emptySubTexto}
            >
              Execute uma varredura para
              começar a criar seu histórico.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FORD_COLORS.bgLight,
  },

  headerBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 260,
    backgroundColor: FORD_COLORS.blueDark,
    borderBottomWidth: 4,
    borderBottomColor:
      FORD_COLORS.bluePrimary,
  },

  scrollContainer: {
    padding: 24,
    paddingBottom: 50,
  },

  // ==========================================================
  // BRANDING
  // ==========================================================

  topBrandingContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 10,
  },

  fordLogoHeader: {
    width: 200,
    height: 60,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  saudacao: {
    fontSize: 10,
    color: FORD_COLORS.chrome,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  nomeUsuario: {
    fontSize: 22,
    fontWeight: '900',
    color: FORD_COLORS.white,
    marginTop: 4,
    letterSpacing: 0.5,
  },

  avatarPequeno: {
    width: 50,
    height: 50,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: FORD_COLORS.bgLight,
  },

  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor:
      FORD_COLORS.bluePrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: FORD_COLORS.white,
  },

  // ==========================================================
  // HERO
  // ==========================================================

  heroCard: {
    backgroundColor: FORD_COLORS.white,
    borderRadius: 4,
    padding: 24,
    marginBottom: 32,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 6,

    borderTopWidth: 4,
    borderTopColor:
      FORD_COLORS.raptorRed,
  },

  heroBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor:
      FORD_COLORS.bgLight,
    paddingBottom: 8,
  },

  heroBadge: {
    color: FORD_COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroTitulo: {
    color: FORD_COLORS.blueDark,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
    lineHeight: 26,
    letterSpacing: 0.5,
  },

  heroSub: {
    color: FORD_COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 24,
    fontWeight: '500',
  },

  heroBotao: {
    flexDirection: 'row',
    backgroundColor:
      FORD_COLORS.blueDark,
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroBotaoTexto: {
    color: FORD_COLORS.white,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // ==========================================================
  // SEÇÕES
  // ==========================================================

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: FORD_COLORS.blueDark,
    marginBottom: 16,
    letterSpacing: 1,
  },

  verTodos: {
    fontSize: 11,
    color: FORD_COLORS.bluePrimary,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  // ==========================================================
  // ATALHOS
  // ==========================================================

  rowAtalhos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },

  atalhoCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: FORD_COLORS.white,
    padding: 16,
    borderRadius: 4,
    marginHorizontal: 4,
    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,

    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,

    alignItems: 'center',
  },

  atalhoIconeBg: {
    width: 44,
    height: 44,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor:
      FORD_COLORS.bgLight,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
  },

  atalhoTexto: {
    flex: 1,
  },

  atalhoTitulo: {
    fontSize: 12,
    fontWeight: '900',
    color: FORD_COLORS.textPrimary,
    letterSpacing: 0.5,
  },

  atalhoSub: {
    fontSize: 9,
    color: FORD_COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // ==========================================================
  // HISTÓRICO
  // ==========================================================

  historicoScroll: {
    paddingRight: 24,
  },

  cardHistoricoMin: {
    backgroundColor: FORD_COLORS.white,
    width: 160,
    minHeight: 130,
    padding: 16,
    borderRadius: 4,
    marginRight: 12,
    elevation: 2,

    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,

    borderLeftWidth: 4,
    borderLeftColor:
      FORD_COLORS.bluePrimary,

    justifyContent: 'space-between',
  },

  historicoHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  dataTextoMin: {
    fontSize: 10,
    color: FORD_COLORS.textSecondary,
    fontWeight: '800',
  },

  nomeVeiculoMin: {
    fontSize: 13,
    fontWeight: '900',
    color: FORD_COLORS.blueDark,
    height: 38,
    lineHeight: 18,
  },

  historicoFooterTag: {
    backgroundColor:
      FORD_COLORS.bgLight,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginTop: 12,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
  },

  historicoTagTexto: {
    fontSize: 8,
    fontWeight: '800',
    color: FORD_COLORS.textSecondary,
    letterSpacing: 0.5,
  },

  // ==========================================================
  // ESTADO VAZIO
  // ==========================================================

  emptyHistorico: {
    backgroundColor: FORD_COLORS.white,
    padding: 30,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    borderStyle: 'dashed',
    marginBottom: 30,
  },

  emptyTexto: {
    color: FORD_COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },

  emptySubTexto: {
    color: FORD_COLORS.textSecondary,
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
});