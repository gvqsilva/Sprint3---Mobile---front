import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  Modal,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const FORD_COLORS = {
  bluePrimary: '#003478',
  blueDark: '#001A3F',
  chrome: '#D1D5DB',
  bgLight: '#F3F4F6',
  white: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  raptorRed: '#E51937',
  success: '#10B981',
  danger: '#EF4444',
};

const BANCO_GIFS = {
  Ranger: require('../../assets/gifs/ranger.gif'),
  Hilux: require('../../assets/gifs/hilux.gif'),
  S10: require('../../assets/gifs/s10.gif'),
  Amarok: require('../../assets/gifs/amarok.gif'),
  Frontier: require('../../assets/gifs/frontier.gif'),
  Triton: require('../../assets/gifs/triton.gif'),
  Rampage: require('../../assets/gifs/rampage.gif'),
  '1500': require('../../assets/gifs/1500.gif'),
  Silverado: require('../../assets/gifs/silverado.gif'),
  'F-150': require('../../assets/gifs/f150.gif'),
  Maverick: require('../../assets/gifs/maverick.gif'),
};

export default function PerfilScreen() {
  const [nome, setNome] = useState('Gabriel');
  const [funcao, setFuncao] = useState('Analista de Mercado');
  const [fotoUri, setFotoUri] = useState(null);
  const [historico, setHistorico] = useState([]);

  const [editandoNome, setEditandoNome] = useState(false);
  const [editandoFuncao, setEditandoFuncao] = useState(false);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);

  const [verTodasSimples, setVerTodasSimples] = useState(false);

  /*
   * ============================================================
   * CARREGAMENTO
   * ============================================================
   */

  useFocusEffect(
    useCallback(() => {
      carregarDadosPerfil();
      carregarHistorico();
    }, [])
  );

  const carregarDadosPerfil = async () => {
    try {
      const [nomeSalvo, funcaoSalva, fotoSalva] = await Promise.all([
        AsyncStorage.getItem('nome_usuario'),
        AsyncStorage.getItem('funcao_usuario'),
        AsyncStorage.getItem('foto_usuario'),
      ]);

      if (nomeSalvo) {
        setNome(nomeSalvo);
      }

      if (funcaoSalva) {
        setFuncao(funcaoSalva);
      }

      if (fotoSalva) {
        setFotoUri(fotoSalva);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    }
  };

  const carregarHistorico = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('historico_pesquisas');

      if (!dadosSalvos) {
        setHistorico([]);
        return;
      }

      const dados = JSON.parse(dadosSalvos);

      if (Array.isArray(dados)) {
        setHistorico(dados);
      } else {
        setHistorico([]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setHistorico([]);
    }
  };

  /*
   * ============================================================
   * PERFIL
   * ============================================================
   */

  const salvarNome = async () => {
    try {
      setEditandoNome(false);

      const novoNome =
        nome.trim() === ''
          ? 'Gabriel'
          : nome.trim();

      setNome(novoNome);

      await AsyncStorage.setItem(
        'nome_usuario',
        novoNome
      );
    } catch (error) {
      console.error('Erro ao salvar nome:', error);
    }
  };

  const salvarFuncao = async () => {
    try {
      setEditandoFuncao(false);

      const novaFuncao =
        funcao.trim() === ''
          ? 'Analista Sênior'
          : funcao.trim();

      setFuncao(novaFuncao);

      await AsyncStorage.setItem(
        'funcao_usuario',
        novaFuncao
      );
    } catch (error) {
      console.error('Erro ao salvar função:', error);
    }
  };

  const escolherFoto = async () => {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso às fotos para escolher uma imagem de perfil.'
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;

        setFotoUri(uri);

        await AsyncStorage.setItem(
          'foto_usuario',
          uri
        );
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);

      Alert.alert(
        'Erro',
        'Não foi possível selecionar a imagem.'
      );
    }
  };

  /*
   * ============================================================
   * HISTÓRICO LOCAL
   * ============================================================
   */

  const limparHistorico = () => {
    Alert.alert(
      'Atenção',
      'Deseja purgar todo o banco de dados local?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Purgar Cofre',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(
                'historico_pesquisas'
              );

              setHistorico([]);
              setRelatorioSelecionado(null);
              setModalVisivel(false);
            } catch (error) {
              console.error(
                'Erro ao limpar histórico:',
                error
              );

              Alert.alert(
                'Erro',
                'Não foi possível limpar o histórico.'
              );
            }
          },
        },
      ]
    );
  };

  const deletarItem = (id) => {
    Alert.alert(
      'Excluir Relatório',
      'Deseja excluir permanentemente este registro?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const novoHistorico = historico.filter(
                (item) => item.id !== id
              );

              setHistorico(novoHistorico);

              await AsyncStorage.setItem(
                'historico_pesquisas',
                JSON.stringify(novoHistorico)
              );

              setModalVisivel(false);
              setRelatorioSelecionado(null);
            } catch (error) {
              console.error(
                'Erro ao excluir relatório:',
                error
              );

              Alert.alert(
                'Erro',
                'Não foi possível excluir o relatório.'
              );
            }
          },
        },
      ]
    );
  };

  const abrirResumo = (item) => {
    setRelatorioSelecionado(item);
    setModalVisivel(true);
  };

  /*
   * ============================================================
   * UTILITÁRIOS
   * ============================================================
   */

  const getAtributo = (especificacoes, chave) => {
    if (
      !Array.isArray(especificacoes) ||
      !chave
    ) {
      return '---';
    }

    const item = especificacoes.find((e) => {
      if (!e?.atributo) return false;

      return e.atributo
        .toLowerCase()
        .includes(chave.toLowerCase());
    });

    return item?.valor || '---';
  };

  const obterGifDoVeiculo = (nomeCompleto) => {
    if (!nomeCompleto) {
      return null;
    }

    const chaves = Object.keys(BANCO_GIFS);

    for (let i = 0; i < chaves.length; i++) {
      if (
        nomeCompleto
          .toLowerCase()
          .includes(chaves[i].toLowerCase())
      ) {
        return BANCO_GIFS[chaves[i]];
      }
    }

    return null;
  };

  /*
   * ============================================================
   * FILTROS
   * ============================================================
   */

  const analisesDashboard = historico.filter(
    (item) =>
      item?.id?.startsWith('radar_') ||
      item?.analiseTaticaCompleta
  );

  const analisesSimples = historico.filter(
    (item) =>
      !item?.id?.startsWith('radar_') &&
      !item?.analiseTaticaCompleta
  );

  const analisesSimplesExibidas =
    verTodasSimples
      ? analisesSimples
      : analisesSimples.slice(0, 5);

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* ======================================================
          HEADER / PERFIL
      ======================================================= */}

      <View style={styles.headerContainer}>
        <View style={styles.capaFundo} />

        <View style={styles.perfilInfos}>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={escolherFoto}
            activeOpacity={0.8}
          >
            {fotoUri ? (
              <Image
                source={{ uri: fotoUri }}
                style={styles.avatarImg}
              />
            ) : (
              <Ionicons
                name="person"
                size={50}
                color={FORD_COLORS.white}
              />
            )}

            <View style={styles.badgeCamera}>
              <Ionicons
                name="camera"
                size={14}
                color={FORD_COLORS.white}
              />
            </View>
          </TouchableOpacity>

          {/* NOME */}

          {editandoNome ? (
            <View style={styles.editInputWrapper}>
              <TextInput
                style={styles.inputNome}
                value={nome}
                onChangeText={setNome}
                onBlur={salvarNome}
                autoFocus
                maxLength={20}
                returnKeyType="done"
                onSubmitEditing={salvarNome}
              />

              <TouchableOpacity
                onPress={salvarNome}
                style={styles.btnCheck}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={FORD_COLORS.success}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.textWrapper}
              onPress={() => setEditandoNome(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.nomeTexto}>
                {nome.toUpperCase()}
              </Text>

              <MaterialCommunityIcons
                name="pencil"
                size={14}
                color={FORD_COLORS.textSecondary}
                style={styles.iconeLapis}
              />
            </TouchableOpacity>
          )}

          {/* FUNÇÃO */}

          {editandoFuncao ? (
            <View style={styles.editInputWrapper}>
              <TextInput
                style={styles.inputFuncao}
                value={funcao}
                onChangeText={setFuncao}
                onBlur={salvarFuncao}
                autoFocus
                maxLength={35}
                returnKeyType="done"
                onSubmitEditing={salvarFuncao}
              />

              <TouchableOpacity
                onPress={salvarFuncao}
                style={styles.btnCheck}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={FORD_COLORS.success}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.textWrapper}
              onPress={() => setEditandoFuncao(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.funcaoTexto}>
                {funcao.toUpperCase()}
              </Text>

              <MaterialCommunityIcons
                name="pencil"
                size={12}
                color={FORD_COLORS.textSecondary}
                style={styles.iconeLapis}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* ====================================================
            ESTATÍSTICAS
        ===================================================== */}

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumero}>
              {historico.length}
            </Text>

            <Text style={styles.statLabel}>
              VARREDURAS
            </Text>
          </View>

          <View style={styles.statDivisor} />

          <View style={styles.statBox}>
            <Text style={styles.statNumero}>
              {
                historico.filter(
                  (i) => i?.comparouRaptor
                ).length
              }
            </Text>

            <Text style={styles.statLabel}>
              DUELOS RAPTOR
            </Text>
          </View>
        </View>

        {/* ====================================================
            HEADER HISTÓRICO
        ===================================================== */}

        <View style={styles.historicoHeader}>
          <Text style={styles.historicoTituloGlobal}>
            COFRE DE INTELIGÊNCIA
          </Text>

          {historico.length > 0 && (
            <TouchableOpacity
              onPress={limparHistorico}
            >
              <Text style={styles.btnLimpar}>
                LIMPAR BASE
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ======================================================
          DASHBOARDS
      ======================================================= */}

      <Text style={styles.seccionTituloInterno}>
        RELATÓRIOS EXECUTIVOS (DASHBOARDS)
      </Text>

      {analisesDashboard.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.cardHistorico,
            {
              borderLeftColor:
                FORD_COLORS.bluePrimary,
              borderLeftWidth: 4,
            },
          ]}
          onPress={() => abrirResumo(item)}
          onLongPress={() => deletarItem(item.id)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.cardIconeBg,
              {
                backgroundColor:
                  FORD_COLORS.blueDark,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="radar"
              size={20}
              color={FORD_COLORS.white}
            />
          </View>

          <View style={styles.cardConteudo}>
            <Text
              style={styles.nomeVeiculo}
              numberOfLines={1}
            >
              {(item.alvoNome || 'ALVO')
                .replace(' (Radar)', '')
                .toUpperCase()}
            </Text>

            <Text style={styles.dataTexto}>
              {item.data || 'Data não disponível'}
            </Text>
          </View>

          <View
            style={[
              styles.badgeDuelo,
              {
                backgroundColor:
                  FORD_COLORS.bgLight,
                borderColor:
                  FORD_COLORS.chrome,
                borderWidth: 1,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeDueloTexto,
                {
                  color:
                    FORD_COLORS.blueDark,
                },
              ]}
            >
              DASHBOARD
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {analisesDashboard.length === 0 && (
        <Text style={styles.textoSemRegistro}>
          Nenhum dashboard tático arquivado.
        </Text>
      )}

      {/* ======================================================
          MAPEAMENTOS SIMPLES
      ======================================================= */}

      <Text
        style={[
          styles.seccionTituloInterno,
          { marginTop: 24 },
        ]}
      >
        MAPEAMENTOS RÁPIDOS (DADOS BRUTOS)
      </Text>

      {analisesSimplesExibidas.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.cardHistorico}
          onPress={() => abrirResumo(item)}
          onLongPress={() => deletarItem(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.cardIconeBg}>
            <MaterialCommunityIcons
              name="clipboard-text"
              size={20}
              color={FORD_COLORS.blueDark}
            />
          </View>

          <View style={styles.cardConteudo}>
            <Text
              style={styles.nomeVeiculo}
              numberOfLines={1}
            >
              {(item.alvoNome || 'ALVO')
                .toUpperCase()}
            </Text>

            <Text style={styles.dataTexto}>
              {item.data || 'Data não disponível'}
            </Text>
          </View>

          {item.comparouRaptor && (
            <View style={styles.badgeDuelo}>
              <Text style={styles.badgeDueloTexto}>
                DUELO IA
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      {analisesSimples.length === 0 && (
        <Text style={styles.textoSemRegistro}>
          Nenhuma análise primária realizada.
        </Text>
      )}

      {!verTodasSimples &&
        analisesSimples.length > 5 && (
          <TouchableOpacity
            style={styles.botaoVerMais}
            onPress={() =>
              setVerTodasSimples(true)
            }
            activeOpacity={0.8}
          >
            <Text style={styles.botaoVerMaisTexto}>
              EXPANDIR BASE (
              {analisesSimples.length})
            </Text>

            <MaterialCommunityIcons
              name="chevron-down"
              size={16}
              color={FORD_COLORS.bluePrimary}
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        )}

      {/* ======================================================
          MODAL
      ======================================================= */}

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setModalVisivel(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {relatorioSelecionado && (
              <>
                {/* HEADER */}

                <View style={styles.modalHeader}>
                  <View
                    style={styles.modalTitleContainer}
                  >
                    <Text
                      style={styles.modalTitle}
                      numberOfLines={2}
                    >
                      {(relatorioSelecionado.alvoNome ||
                        'ALVO')
                        .replace(' (Radar)', '')
                        .toUpperCase()}
                    </Text>

                    <Text
                      style={styles.modalDate}
                    >
                      {relatorioSelecionado.data ||
                        'Data não disponível'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      setModalVisivel(false)
                    }
                    style={styles.closeBtn}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={
                        FORD_COLORS.textPrimary
                      }
                    />
                  </TouchableOpacity>
                </View>

                {/* GIF */}

                {obterGifDoVeiculo(
                  relatorioSelecionado.alvoNome
                ) && (
                  <View
                    style={
                      styles.modalGifContainer
                    }
                  >
                    <Image
                      source={obterGifDoVeiculo(
                        relatorioSelecionado.alvoNome
                      )}
                      style={
                        styles.modalGifBanner
                      }
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* RESUMO TÉCNICO */}

                <Text style={styles.sectionLabel}>
                  RESUMO TÉCNICO
                </Text>

                <View style={styles.quickStatsRow}>
                  <View
                    style={styles.quickStatBox}
                  >
                    <Text
                      style={
                        styles.quickStatValue
                      }
                      numberOfLines={1}
                    >
                      {getAtributo(
                        relatorioSelecionado
                          .dadosAlvoCompleto
                          ?.especificacoes,
                        'preço'
                      ).toUpperCase()}
                    </Text>

                    <Text
                      style={
                        styles.quickStatLabel
                      }
                    >
                      ESTIMATIVA
                    </Text>
                  </View>

                  <View
                    style={styles.quickStatBox}
                  >
                    <Text
                      style={
                        styles.quickStatValue
                      }
                    >
                      {getAtributo(
                        relatorioSelecionado
                          .dadosAlvoCompleto
                          ?.especificacoes,
                        'potência'
                      ).toUpperCase()}
                    </Text>

                    <Text
                      style={
                        styles.quickStatLabel
                      }
                    >
                      POTÊNCIA
                    </Text>
                  </View>

                  <View
                    style={styles.quickStatBox}
                  >
                    <Text
                      style={
                        styles.quickStatValue
                      }
                    >
                      {getAtributo(
                        relatorioSelecionado
                          .dadosAlvoCompleto
                          ?.especificacoes,
                        'torque'
                      ).toUpperCase()}
                    </Text>

                    <Text
                      style={
                        styles.quickStatLabel
                      }
                    >
                      TORQUE
                    </Text>
                  </View>
                </View>

                {/* DUELO RAPTOR */}

                {relatorioSelecionado
                  .dadosRaptorCompleto
                  ?.veredito && (
                  <View
                    style={styles.insightBox}
                  >
                    <View
                      style={
                        styles.insightHeader
                      }
                    >
                      <MaterialCommunityIcons
                        name="sword-cross"
                        size={16}
                        color={
                          FORD_COLORS.raptorRed
                        }
                      />

                      <Text
                        style={
                          styles.insightTitle
                        }
                      >
                        VEREDITO VS RAPTOR
                      </Text>
                    </View>

                    <Text
                      style={styles.insightText}
                    >
                      {
                        relatorioSelecionado
                          .dadosRaptorCompleto
                          .veredito
                      }
                    </Text>
                  </View>
                )}

                {/* DIRETRIZ P&D */}

                {relatorioSelecionado
                  .analiseTaticaCompleta
                  ?.diretrizNextGen && (
                  <View
                    style={[
                      styles.insightBox,
                      {
                        backgroundColor:
                          '#FFFBEB',
                        borderColor:
                          '#FEF3C7',
                        marginTop: 12,
                        borderLeftColor:
                          '#F59E0B',
                      },
                    ]}
                  >
                    <View
                      style={
                        styles.insightHeader
                      }
                    >
                      <MaterialCommunityIcons
                        name="lightbulb-on"
                        size={16}
                        color="#B45309"
                      />

                      <Text
                        style={[
                          styles.insightTitle,
                          {
                            color: '#B45309',
                          },
                        ]}
                      >
                        DIRETRIZ P&D
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.insightText,
                        {
                          color: '#92400E',
                        },
                      ]}
                    >
                      {
                        relatorioSelecionado
                          .analiseTaticaCompleta
                          .diretrizNextGen
                      }
                    </Text>
                  </View>
                )}

                {/* SEM INSIGHT */}

                {!relatorioSelecionado
                  .dadosRaptorCompleto
                  ?.veredito &&
                  !relatorioSelecionado
                    .analiseTaticaCompleta && (
                    <View
                      style={
                        styles.noInsightBox
                      }
                    >
                      <Text
                        style={
                          styles.noInsightText
                        }
                      >
                        ALVO NÃO SUBMETIDO A
                        DUELO TÁTICO NESTA
                        VARREDURA.
                      </Text>
                    </View>
                  )}

                {/* EXCLUIR */}

                <TouchableOpacity
                  style={
                    styles.btnExcluirModal
                  }
                  onPress={() =>
                    deletarItem(
                      relatorioSelecionado.id
                    )
                  }
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={16}
                    color={
                      FORD_COLORS.danger
                    }
                    style={{
                      marginRight: 6,
                    }}
                  />

                  <Text
                    style={
                      styles.btnExcluirModalTexto
                    }
                  >
                    EXCLUIR RELATÓRIO
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FORD_COLORS.bgLight,
  },

  headerContainer: {
    alignItems: 'center',
    width: '100%',
  },

  capaFundo: {
    position: 'absolute',
    top: 0,
    height: 160,
    width: '100%',
    backgroundColor: FORD_COLORS.blueDark,
    borderBottomWidth: 4,
    borderBottomColor:
      FORD_COLORS.bluePrimary,
  },

  perfilInfos: {
    alignItems: 'center',
    marginTop: 90,
    marginBottom: 24,
    width: '100%',
    paddingHorizontal: 20,
  },

  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 4,
    backgroundColor:
      FORD_COLORS.bluePrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: FORD_COLORS.bgLight,
    elevation: 4,
    marginBottom: 16,
  },

  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },

  badgeCamera: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor:
      FORD_COLORS.raptorRed,
    padding: 6,
    borderRadius: 2,
  },

  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },

  nomeTexto: {
    fontSize: 22,
    fontWeight: '900',
    color: FORD_COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  funcaoTexto: {
    fontSize: 11,
    color: FORD_COLORS.textSecondary,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 2,
  },

  iconeLapis: {
    marginLeft: 6,
    opacity: 0.8,
  },

  editInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginVertical: 4,
  },

  inputNome: {
    fontSize: 18,
    fontWeight: '900',
    color: FORD_COLORS.textPrimary,
    backgroundColor: FORD_COLORS.white,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    textAlign: 'center',
    flex: 1,
  },

  inputFuncao: {
    fontSize: 11,
    fontWeight: '800',
    color: FORD_COLORS.textSecondary,
    backgroundColor: FORD_COLORS.white,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    textAlign: 'center',
    flex: 1,
  },

  btnCheck: {
    marginLeft: 8,
  },

  statsContainer: {
    flexDirection: 'row',
    backgroundColor: FORD_COLORS.white,
    borderRadius: 4,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 32,
    elevation: 2,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    width: '88%',
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statNumero: {
    fontSize: 20,
    fontWeight: '900',
    color: FORD_COLORS.blueDark,
  },

  statLabel: {
    fontSize: 9,
    color: FORD_COLORS.textSecondary,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },

  statDivisor: {
    width: 1,
    backgroundColor:
      FORD_COLORS.chrome,
  },

  historicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 12,
  },

  historicoTituloGlobal: {
    fontSize: 16,
    fontWeight: '900',
    color: FORD_COLORS.blueDark,
    letterSpacing: 1,
  },

  btnLimpar: {
    fontSize: 10,
    fontWeight: '900',
    color: FORD_COLORS.raptorRed,
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  seccionTituloInterno: {
    fontSize: 11,
    fontWeight: '900',
    color: FORD_COLORS.textSecondary,
    letterSpacing: 1,
    marginHorizontal: 24,
    marginBottom: 12,
    marginTop: 16,
  },

  textoSemRegistro: {
    fontSize: 11,
    color: FORD_COLORS.textSecondary,
    fontStyle: 'italic',
    marginHorizontal: 24,
    marginBottom: 8,
    fontWeight: '600',
  },

  cardHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FORD_COLORS.white,
    padding: 16,
    borderRadius: 4,
    marginHorizontal: 24,
    marginBottom: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    width: '88%',
  },

  cardIconeBg: {
    width: 36,
    height: 36,
    borderRadius: 2,
    backgroundColor:
      FORD_COLORS.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
  },

  cardConteudo: {
    flex: 1,
  },

  nomeVeiculo: {
    fontSize: 13,
    fontWeight: '900',
    color: FORD_COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },

  dataTexto: {
    fontSize: 9,
    color: FORD_COLORS.textSecondary,
    fontWeight: '800',
  },

  badgeDuelo: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  badgeDueloTexto: {
    fontSize: 8,
    fontWeight: '900',
    color: FORD_COLORS.raptorRed,
    letterSpacing: 0.5,
  },

  botaoVerMais: {
    flexDirection: 'row',
    backgroundColor: FORD_COLORS.white,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    borderRadius: 4,
    padding: 14,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '88%',
    elevation: 1,
  },

  botaoVerMaisTexto: {
    fontSize: 11,
    color: FORD_COLORS.bluePrimary,
    fontWeight: '900',
    letterSpacing: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0,26,63,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    backgroundColor:
      FORD_COLORS.bgLight,
    width: '90%',
    borderRadius: 4,
    padding: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor:
      FORD_COLORS.bluePrimary,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  modalTitleContainer: {
    flex: 1,
    paddingRight: 16,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: FORD_COLORS.blueDark,
    letterSpacing: 1,
  },

  modalDate: {
    fontSize: 10,
    color: FORD_COLORS.textSecondary,
    fontWeight: '800',
    marginTop: 4,
  },

  closeBtn: {
    marginTop: -4,
    marginRight: -8,
    marginLeft: 8,
  },

  modalGifContainer: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
  },

  modalGifBanner: {
    width: '100%',
    height: 120,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: FORD_COLORS.blueDark,
    letterSpacing: 1,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor:
      FORD_COLORS.chrome,
    paddingBottom: 4,
  },

  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  quickStatBox: {
    flex: 1,
    backgroundColor: FORD_COLORS.white,
    padding: 10,
    borderRadius: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    marginHorizontal: 4,
  },

  quickStatValue: {
    fontSize: 11,
    fontWeight: '900',
    color: FORD_COLORS.textPrimary,
    marginTop: 6,
    marginBottom: 2,
    textAlign: 'center',
  },

  quickStatLabel: {
    fontSize: 8,
    color: FORD_COLORS.textSecondary,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  insightBox: {
    backgroundColor: FORD_COLORS.white,
    padding: 14,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    borderLeftWidth: 4,
    borderLeftColor:
      FORD_COLORS.raptorRed,
  },

  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  insightTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: FORD_COLORS.blueDark,
    letterSpacing: 0.5,
    marginLeft: 6,
  },

  insightText: {
    fontSize: 11,
    color: FORD_COLORS.textSecondary,
    lineHeight: 16,
    fontStyle: 'italic',
    fontWeight: '600',
  },

  noInsightBox: {
    backgroundColor: FORD_COLORS.chrome,
    padding: 12,
    borderRadius: 2,
    alignItems: 'center',
    marginTop: 8,
  },

  noInsightText: {
    fontSize: 9,
    color: FORD_COLORS.textPrimary,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  btnExcluirModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor:
      FORD_COLORS.chrome,
  },

  btnExcluirModalTexto: {
    color: FORD_COLORS.danger,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
});