import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

/*
|--------------------------------------------------------------------------
| CONFIGURAÇÃO DA API
|--------------------------------------------------------------------------
|
| Android Emulator:
| http://10.0.2.2:8000
|
| Expo Go em celular físico:
| http://IP_DO_SEU_PC:8000
|
| Exemplo:
| http://192.168.1.10:8000
|
*/

const API_BASE_URL = 'https://mobilebackend-hjyr.onrender.com';

const ATRIBUTOS_PADRAO =
  'Preço Estimado Atual (R$), Potência (cv), Torque (kgfm), Motorização, Transmissão/Câmbio, Tração, Capacidade de Carga/Porta-Malas, Suspensão/Amortecedores, Ângulo de Ataque, Modos de Condução';

const FORD_COLORS = {
  bluePrimary: '#003478',
  blueDark: '#001A3F',
  chrome: '#D1D5DB',
  bgLight: '#F3F4F6',
  white: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  raptorRed: '#E51937',
  success: '#166534',
};

const BANCO_VEICULOS = {
  Ford: {
    PICAPE: {
      Ranger: [
        'Raptor 3.0 V6',
        'Limited 3.0 V6 Diesel 4WD',
        'XLS 2.0 Diesel 4x4',
      ],
      Maverick: ['Black', 'Tremor', 'Hybrid'],
      'F-150': ['Lariat', 'Lariat Black', 'Tremor'],
    },
    SUV: {
      'Bronco Sport': ['Badlands 2.0L'],
      Territory: ['Titanium'],
    },
  },

  Toyota: {
    PICAPE: {
      Hilux: ['SRV AT', 'SRX Plus AT'],
    },
    SUV: {
      SW4: [
        'SRX Platinum 5 lugares',
        'SRX Platinum 7 lugares',
        'Diamond',
      ],
      RAV4: ['S Híbrido', 'SX Híbrido'],
    },
  },

  Chevrolet: {
    PICAPE: {
      S10: ['High Country', 'LTZ', 'Z71'],
      Silverado: ['High Country'],
    },
    SUV: {
      Trailblazer: ['2026'],
      Equinox: ['Active', 'RS'],
    },
  },

  Volkswagen: {
    PICAPE: {
      Amarok: ['V6 Comfortline', 'V6 Highline', 'V6 Extreme'],
    },
    SUV: {
      Taos: ['Conforline'],
      'Tiguan Allspace': ['R-Line'],
    },
  },

  Nissan: {
    PICAPE: {
      Frontier: [
        'ATTACK AT 4x4',
        'PLATINUM AT',
        'PRO-4X AT',
      ],
    },
    SUV: {},
  },

  Mitsubishi: {
    PICAPE: {
      Triton: ['Katana', 'HPE-S', 'Savana'],
    },
    SUV: {
      Outlander: ['HPE-S', 'Signature'],
    },
  },

  RAM: {
    PICAPE: {
      Rampage: ['Big Horn', 'Laramie', 'R/T'],
      '1500': ['Laramie', 'Rebel'],
    },
    SUV: {},
  },
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
  'Bronco Sport': require('../../assets/gifs/bronco.gif'),
  Territory: require('../../assets/gifs/territory.gif'),
  SW4: require('../../assets/gifs/sw4.gif'),
  RAV4: require('../../assets/gifs/rav4.gif'),
  Trailblazer: require('../../assets/gifs/trailblazer.gif'),
  Equinox: require('../../assets/gifs/equinox.gif'),
  Taos: require('../../assets/gifs/taos.gif'),
  'Tiguan Allspace': require('../../assets/gifs/tiguan.gif'),
  Outlander: require('../../assets/gifs/outlander.gif'),
};

const PERFIS_USO = [
  {
    id: 'urbano',
    nome: 'USO URBANO',
    iconName: 'city',
  },
  {
    id: 'agro',
    nome: 'TRABALHO PESADO / AGRO',
    iconName: 'tractor',
  },
  {
    id: 'offroad',
    nome: 'OFF-ROAD',
    iconName: 'terrain',
  },
];

const GABARITO_RAPTOR = {
  'Preço Estimado Atual (R$)': 'R$ 499.000',
  'Potência (cv)': '397 cv',
  'Torque (kgfm)': '59,4 kgfm',
  Motorização: '3.0 V6 Bi-Turbo Gasolina',
  'Transmissão/Câmbio': 'Automática de 10 mudanças',
  Tração: '4WD (4x4 Avançado)',
  'Capacidade de Carga (kg)': '736 kg',
  'Suspensão/Amortecedores': 'Amortecedores Fox 2.5 Live Valve',
  'Ângulo de Ataque': '32 graus',
  'Modos de Condução': '7 modos',
};

const SCORES_RAPTOR = {
  forca: 9,
  tecnologia: 10,
  offRoad: 10,
  custoBeneficio: 6,
};

export default function PesquisaScreen({ navigation }) {
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [modelo, setModelo] = useState('');
  const [versao, setVersao] = useState('');

  const [menuAberto, setMenuAberto] = useState(null);
  const [perfilUso, setPerfilUso] = useState('urbano');

  const [dadosAlvo, setDadosAlvo] = useState(null);
  const [dadosRaptor, setDadosRaptor] = useState(null);

  const [carregando, setCarregando] = useState(false);
  const [carregandoRaptor, setCarregandoRaptor] = useState(false);

  const [idPesquisaAtual, setIdPesquisaAtual] = useState(null);

  const viewRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | RESET AO SAIR DA TELA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setMarca('');
      setCategoria('');
      setModelo('');
      setVersao('');

      setDadosAlvo(null);
      setDadosRaptor(null);

      setMenuAberto(null);
      setPerfilUso('urbano');

      setCarregando(false);
      setCarregandoRaptor(false);
      setIdPesquisaAtual(null);
    });

    return unsubscribe;
  }, [navigation]);

  /*
  |--------------------------------------------------------------------------
  | PESQUISA DO VEÍCULO
  |--------------------------------------------------------------------------
  |
  | Agora o aplicativo NÃO acessa mais a Groq.
  |
  | React Native
  |      ↓
  | FastAPI /api/v1/pesquisa
  |      ↓
  | Groq
  |
  */

  const chamarLlamaDados = async (
    marcaAlvo,
    categoriaAlvo,
    modeloAlvo,
    versaoAlvo
  ) => {
    try {
      const resposta = await fetch(
        `${API_BASE_URL}/api/v1/pesquisa`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },

          body: JSON.stringify({
            marca: marcaAlvo,
            categoria: categoriaAlvo,
            modelo: modeloAlvo,
            versao: versaoAlvo,
          }),
        }
      );

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados?.detail ||
            `Erro HTTP ${resposta.status} ao consultar o servidor.`
        );
      }

      if (
        !dados ||
        !dados.nomeCompleto ||
        !Array.isArray(dados.especificacoes)
      ) {
        throw new Error(
          'O servidor retornou um formato de dados inválido.'
        );
      }

      return dados;
    } catch (erro) {
      console.error('Erro na pesquisa:', erro);

      if (
        erro?.message?.includes('Network request failed') ||
        erro?.message?.includes('Failed to fetch')
      ) {
        throw new Error(
          `Não foi possível conectar ao servidor.

Verifique se o FastAPI está rodando em:
${API_BASE_URL}

Se estiver usando celular físico, confira se API_BASE_URL usa o IP do seu computador.`
        );
      }

      throw erro;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DUELO CONTRA RANGER RAPTOR
  |--------------------------------------------------------------------------
  */

  const chamarLlamaComparacao = async (
    veiculoAtual,
    perfil
  ) => {
    const precoConcorrente =
      veiculoAtual?.especificacoes?.find((item) =>
        String(item?.atributo || '')
          .toLowerCase()
          .includes('preço')
      )?.valor || 'R$ 300.000';

    try {
      const resposta = await fetch(
        `${API_BASE_URL}/api/v1/duelo`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },

          body: JSON.stringify({
            nome_completo:
              veiculoAtual?.nomeCompleto ||
              'Veículo não informado',

            preco_concorrente: precoConcorrente,

            perfil_uso: perfil,
          }),
        }
      );

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados?.detail ||
            `Erro HTTP ${resposta.status} ao gerar o duelo.`
        );
      }

      if (!dados?.veredito) {
        throw new Error(
          'O servidor retornou um duelo sem veredito.'
        );
      }

      return dados;
    } catch (erro) {
      console.error('Erro no duelo:', erro);

      if (
        erro?.message?.includes('Network request failed') ||
        erro?.message?.includes('Failed to fetch')
      ) {
        throw new Error(
          `Não foi possível conectar ao servidor.

Verifique se o FastAPI está rodando em:
${API_BASE_URL}`
        );
      }

      throw erro;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | GERAR MATRIZ DE DADOS
  |--------------------------------------------------------------------------
  */

  const gerarEspecificacoes = async () => {
    if (!marca || !categoria || !modelo || !versao) {
      Alert.alert(
        'Aviso',
        'Preencha todos os parâmetros (Marca, Categoria, Modelo e Versão) para iniciar a varredura.'
      );

      return;
    }

    setCarregando(true);
    setDadosAlvo(null);
    setDadosRaptor(null);
    setMenuAberto(null);

    try {
      const resultado = await chamarLlamaDados(
        marca,
        categoria,
        modelo,
        versao
      );

      setDadosAlvo(resultado);

      /*
      |--------------------------------------------------------------------------
      | HISTÓRICO LOCAL
      |--------------------------------------------------------------------------
      */

      const id = Date.now().toString();

      setIdPesquisaAtual(id);

      const novoItem = {
        id,
        data: new Date().toLocaleString('pt-BR'),

        alvoNome:
          resultado.nomeCompleto ||
          `${marca} ${modelo} ${versao}`,

        comparouRaptor: false,

        dadosAlvoCompleto: resultado,
      };

      const historicoSalvo =
        await AsyncStorage.getItem(
          'historico_pesquisas'
        );

      let historico = [];

      if (historicoSalvo) {
        try {
          historico = JSON.parse(historicoSalvo);

          if (!Array.isArray(historico)) {
            historico = [];
          }
        } catch {
          historico = [];
        }
      }

      await AsyncStorage.setItem(
        'historico_pesquisas',
        JSON.stringify([
          novoItem,
          ...historico,
        ])
      );
    } catch (erro) {
      console.error(
        'Erro ao processar pesquisa:',
        erro
      );

      Alert.alert(
        'Falha na pesquisa',
        erro?.message ||
          'Não foi possível processar os dados.'
      );
    } finally {
      setCarregando(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | COMPARAR COM RAPTOR
  |--------------------------------------------------------------------------
  */

  const compararComRaptor = async () => {
    if (!dadosAlvo) {
      Alert.alert(
        'Aviso',
        'Gere primeiro a matriz de dados do veículo.'
      );

      return;
    }

    const perfilSelecionado =
      PERFIS_USO.find(
        (perfil) => perfil.id === perfilUso
      );

    const nomePerfil =
      perfilSelecionado?.nome || 'USO URBANO';

    setCarregandoRaptor(true);

    try {
      const resultadoCompetitivo =
        await chamarLlamaComparacao(
          dadosAlvo,
          nomePerfil
        );

      setDadosRaptor(resultadoCompetitivo);

      /*
      |--------------------------------------------------------------------------
      | ATUALIZA HISTÓRICO LOCAL
      |--------------------------------------------------------------------------
      */

      const historicoSalvo =
        await AsyncStorage.getItem(
          'historico_pesquisas'
        );

      if (historicoSalvo && idPesquisaAtual) {
        try {
          const arrayHistorico =
            JSON.parse(historicoSalvo);

          if (Array.isArray(arrayHistorico)) {
            const index =
              arrayHistorico.findIndex(
                (item) =>
                  item.id === idPesquisaAtual
              );

            if (index > -1) {
              arrayHistorico[index] = {
                ...arrayHistorico[index],

                comparouRaptor: true,

                dadosRaptorCompleto:
                  resultadoCompetitivo,
              };

              await AsyncStorage.setItem(
                'historico_pesquisas',
                JSON.stringify(arrayHistorico)
              );
            }
          }
        } catch (erroHistorico) {
          console.error(
            'Erro ao atualizar histórico:',
            erroHistorico
          );
        }
      }
    } catch (erro) {
      console.error(
        'Erro na geração do duelo:',
        erro
      );

      Alert.alert(
        'Falha no duelo',
        erro?.message ||
          'Não foi possível gerar o duelo estratégico.'
      );
    } finally {
      setCarregandoRaptor(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | COMPARTILHAR RELATÓRIO
  |--------------------------------------------------------------------------
  */

  const compartilharRelatorio = async () => {
    try {
      if (!viewRef.current) {
        throw new Error(
          'Área do relatório não encontrada.'
        );
      }

      const uri = await captureRef(
        viewRef,
        {
          format: 'png',
          quality: 1,
        }
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Exportar Relatório',
        });
      } else {
        Alert.alert(
          'Compartilhamento indisponível',
          'O compartilhamento não está disponível neste dispositivo.'
        );
      }
    } catch (erro) {
      console.error(
        'Erro ao compartilhar relatório:',
        erro
      );

      Alert.alert(
        'Erro',
        'Não foi possível gerar a imagem do relatório.'
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DROPDOWN
  |--------------------------------------------------------------------------
  */

  const renderDropdown = (
    tipo,
    valorAtual,
    opcoes,
    bloqueado = false
  ) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.labelInput}>
        {tipo.toUpperCase()}
      </Text>

      <TouchableOpacity
        style={[
          styles.dropdownHeader,
          bloqueado &&
            styles.dropdownBloqueado,
        ]}
        onPress={() =>
          !bloqueado &&
          setMenuAberto(
            menuAberto === tipo
              ? null
              : tipo
          )
        }
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.dropdownTexto,
            !valorAtual && {
              color:
                FORD_COLORS.textSecondary,
            },
          ]}
        >
          {valorAtual
            ? valorAtual.toUpperCase()
            : 'SELECIONAR'}
        </Text>

        <Ionicons
          name={
            menuAberto === tipo
              ? 'chevron-up'
              : 'chevron-down'
          }
          size={16}
          color={FORD_COLORS.textPrimary}
        />
      </TouchableOpacity>

      {menuAberto === tipo && (
        <View style={styles.dropdownLista}>
          {opcoes.map((opcao, idx) => (
            <TouchableOpacity
              key={`${tipo}-${opcao}-${idx}`}
              style={styles.dropdownItem}
              onPress={() => {
                setDadosAlvo(null);
                setDadosRaptor(null);

                if (tipo === 'marca') {
                  setMarca(opcao);
                  setCategoria('');
                  setModelo('');
                  setVersao('');
                }

                if (tipo === 'categoria') {
                  setCategoria(opcao);
                  setModelo('');
                  setVersao('');
                }

                if (tipo === 'modelo') {
                  setModelo(opcao);
                  setVersao('');
                }

                if (tipo === 'versao') {
                  setVersao(opcao);
                }

                setMenuAberto(null);
              }}
            >
              <Text
                style={
                  styles.dropdownItemTexto
                }
              >
                {opcao.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  /*
  |--------------------------------------------------------------------------
  | BARRAS DE PERFORMANCE
  |--------------------------------------------------------------------------
  */

  const renderBarraPerformance = (
    label,
    scoreAlvo,
    scoreRaptor
  ) => {
    const alvo = Math.max(
      0,
      Math.min(
        10,
        Number(scoreAlvo) || 0
      )
    );

    const raptor =
      scoreRaptor !== undefined
        ? Math.max(
            0,
            Math.min(
              10,
              Number(scoreRaptor) || 0
            )
          )
        : undefined;

    return (
      <View style={styles.barraContainer}>
        <Text style={styles.barraLabel}>
          {label}
        </Text>

        <View style={styles.barraLinha}>
          <Text
            style={styles.barraValorTexto}
          >
            {alvo}
          </Text>

          <View style={styles.barraTrilho}>
            <View
              style={[
                styles.barraPreenchimento,
                {
                  width: `${alvo * 10}%`,
                  backgroundColor:
                    FORD_COLORS.bluePrimary,
                },
              ]}
            />
          </View>
        </View>

        {raptor !== undefined && (
          <View
            style={[
              styles.barraLinha,
              { marginTop: 6 },
            ]}
          >
            <Text
              style={[
                styles.barraValorTexto,
                {
                  color:
                    FORD_COLORS.raptorRed,
                },
              ]}
            >
              {raptor}
            </Text>

            <View style={styles.barraTrilho}>
              <View
                style={[
                  styles.barraPreenchimento,
                  {
                    width: `${raptor * 10}%`,
                    backgroundColor:
                      FORD_COLORS.raptorRed,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.fordHeader}>
        <View style={styles.headerIconBg}>
          <MaterialCommunityIcons
            name="car-cog"
            size={26}
            color={FORD_COLORS.white}
          />
        </View>

        <View>
          <Text style={styles.fordTitle}>
            ANÁLISE DE MERCADO
          </Text>

          <Text style={styles.fordSub}>
            MÓDULO DE DADOS E COMPETITIVIDADE
          </Text>
        </View>
      </View>

      <View style={styles.perfilUsoContainer}>
        <Text style={styles.labelInput}>
          PERFIL DE USO DA FROTA
        </Text>

        <View style={styles.perfilRow}>
          {PERFIS_USO.map((perfil) => (
            <TouchableOpacity
              key={perfil.id}
              style={[
                styles.perfilBotao,
                perfilUso === perfil.id &&
                  styles.perfilBotaoAtivo,
              ]}
              onPress={() => {
                setDadosAlvo(null);
                setDadosRaptor(null);
                setPerfilUso(perfil.id);
              }}
              activeOpacity={0.9}
            >
              <MaterialCommunityIcons
                name={perfil.iconName}
                size={22}
                color={
                  perfilUso === perfil.id
                    ? FORD_COLORS.white
                    : FORD_COLORS.bluePrimary
                }
                style={{
                  marginBottom: 8,
                }}
              />

              <Text
                style={[
                  styles.perfilTexto,
                  perfilUso === perfil.id &&
                    styles.perfilTextoAtivo,
                ]}
              >
                {perfil.nome.split(
                  ' / '
                )[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View
        style={{
          width: '100%',
          zIndex: 10,
        }}
      >
        {renderDropdown(
          'marca',
          marca,
          Object.keys(
            BANCO_VEICULOS
          )
        )}

        {renderDropdown(
          'categoria',
          categoria,
          marca
            ? Object.keys(
                BANCO_VEICULOS[
                  marca
                ]
              ).filter(
                (cat) =>
                  Object.keys(
                    BANCO_VEICULOS[
                      marca
                    ][cat]
                  ).length > 0
              )
            : [],
          !marca
        )}

        {renderDropdown(
          'modelo',
          modelo,
          categoria
            ? Object.keys(
                BANCO_VEICULOS[
                  marca
                ][categoria]
              )
            : [],
          !categoria
        )}

        {renderDropdown(
          'versao',
          versao,
          modelo
            ? BANCO_VEICULOS[
                marca
              ][categoria][modelo]
            : [],
          !modelo
        )}
      </View>

      <TouchableOpacity
        style={styles.botaoPrincipal}
        onPress={gerarEspecificacoes}
        disabled={carregando}
        activeOpacity={0.9}
      >
        {carregando ? (
          <ActivityIndicator
            size="small"
            color={FORD_COLORS.white}
            style={{
              marginRight: 10,
            }}
          />
        ) : (
          <MaterialCommunityIcons
            name="database-search"
            size={20}
            color={FORD_COLORS.white}
            style={{
              marginRight: 10,
            }}
          />
        )}

        <Text
          style={
            styles.botaoPrincipalTexto
          }
        >
          {carregando
            ? 'PROCESSANDO IA...'
            : 'GERAR MATRIZ DE DADOS'}
        </Text>
      </TouchableOpacity>

      {(carregando ||
        carregandoRaptor) && (
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={
              FORD_COLORS.bluePrimary
            }
            style={{
              marginBottom: 16,
            }}
          />

          <Text
            style={styles.loadingTexto}
          >
            {carregandoRaptor
              ? 'ANALISANDO PERFIL ECONÔMICO...'
              : 'MAPEANDO ESPECIFICAÇÕES...'}
          </Text>
        </View>
      )}

      {!dadosAlvo && !carregando && (
        <View
          style={
            styles.emptyStateContainer
          }
        >
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={48}
            color={FORD_COLORS.chrome}
            style={{
              marginBottom: 12,
            }}
          />

          <Text
            style={
              styles.emptyStateTitle
            }
          >
            SISTEMA EM ESPERA
          </Text>

          <Text
            style={
              styles.emptyStateSub
            }
          >
            Selecione os parâmetros
            técnicos acima para iniciar
            o mapeamento.
          </Text>
        </View>
      )}

      {dadosAlvo && !carregando && (
        <View
          style={
            styles.resultadoGeralWrapper
          }
        >
          {BANCO_GIFS[modelo] && (
            <View
              style={styles.gifContainer}
            >
              <Image
                source={
                  BANCO_GIFS[modelo]
                }
                style={styles.gifImagem}
                resizeMode="cover"
              />

              <View
                style={
                  styles.gifLegendaBox
                }
              >
                <Text
                  style={
                    styles.gifLegenda
                  }
                >
                  ALVO CONFIRMADO:{' '}
                  {(
                    dadosAlvo.nomeCompleto ||
                    `${marca} ${modelo} ${versao}`
                  ).toUpperCase()}
                </Text>
              </View>
            </View>
          )}

          <View
            ref={viewRef}
            collapsable={false}
            style={
              styles.tabelaContainerExport
            }
          >
            <View
              style={
                styles.tabelaHeaderGlobal
              }
            >
              <MaterialCommunityIcons
                name="table-large"
                size={20}
                color={
                  FORD_COLORS.blueDark
                }
              />

              <Text
                style={
                  styles.tabelaTituloGlobal
                }
              >
                RELATÓRIO TÉCNICO BRUTO
              </Text>
            </View>

            <View
              style={[
                styles.tabelaLinha,
                styles.linhaHeader,
              ]}
            >
              <Text
                style={[
                  styles.celula,
                  styles.textoHeader,
                  { flex: 1.2 },
                ]}
              >
                ATRIBUTO
              </Text>

              <Text
                style={[
                  styles.celula,
                  styles.textoHeaderVeiculo,
                  { flex: 1 },
                ]}
              >
                ALVO
              </Text>

              {dadosRaptor && (
                <Text
                  style={[
                    styles.celula,
                    styles.textoHeaderRaptor,
                    { flex: 1 },
                  ]}
                >
                  RAPTOR
                </Text>
              )}
            </View>

            {Array.isArray(
              dadosAlvo.especificacoes
            ) &&
              dadosAlvo.especificacoes.map(
                (item, index) => {
                  const atributo =
                    String(
                      item?.atributo || ''
                    );

                  const valor =
                    String(
                      item?.valor || 'N/A'
                    );

                  const valorFixoRaptor =
                    GABARITO_RAPTOR[
                      atributo
                    ] || 'N/A';

                  const isPreco =
                    atributo
                      .toLowerCase()
                      .includes('preço');

                  const zebraStyle =
                    index % 2 === 0
                      ? {
                          backgroundColor:
                            '#FFFFFF',
                        }
                      : {
                          backgroundColor:
                            '#F9FAFB',
                        };

                  return (
                    <View
                      key={`${atributo}-${index}`}
                      style={[
                        styles.tabelaLinha,
                        zebraStyle,
                        isPreco &&
                          styles.linhaPreco,
                      ]}
                    >
                      <Text
                        style={[
                          styles.celula,
                          styles.atributoLabel,
                          {
                            flex: 1.2,
                          },
                        ]}
                      >
                        {atributo.toUpperCase()}
                      </Text>

                      <View
                        style={[
                          styles.boxValor,
                          { flex: 1 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.celula,
                            isPreco &&
                              styles.textoPreco,
                          ]}
                        >
                          {valor.toUpperCase()}
                        </Text>
                      </View>

                      {dadosRaptor && (
                        <View
                          style={[
                            styles.boxValor,
                            {
                              flex: 1,
                              backgroundColor:
                                isPreco
                                  ? '#FEF2F2'
                                  : 'transparent',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.celula,
                              isPreco &&
                                styles.textoPrecoRaptor,
                            ]}
                          >
                            {String(
                              valorFixoRaptor
                            ).toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                }
              )}

            {dadosAlvo.scores && (
              <View
                style={
                  styles.radarContainer
                }
              >
                <Text
                  style={
                    styles.radarTitulo
                  }
                >
                  DESEMPENHO
                  MULTIDIMENSIONAL
                </Text>

                {renderBarraPerformance(
                  'FORÇA BRUTA',
                  dadosAlvo?.scores?.forca,
                  dadosRaptor
                    ? SCORES_RAPTOR.forca
                    : undefined
                )}

                {renderBarraPerformance(
                  'TECNOLOGIA',
                  dadosAlvo?.scores
                    ?.tecnologia,
                  dadosRaptor
                    ? SCORES_RAPTOR.tecnologia
                    : undefined
                )}

                {renderBarraPerformance(
                  'OFF-ROAD',
                  dadosAlvo?.scores?.offRoad,
                  dadosRaptor
                    ? SCORES_RAPTOR.offRoad
                    : undefined
                )}

                {renderBarraPerformance(
                  'CUSTO-BENEFÍCIO',
                  dadosAlvo?.scores
                    ?.custoBeneficio,
                  dadosRaptor
                    ? SCORES_RAPTOR.custoBeneficio
                    : undefined
                )}

                {dadosRaptor && (
                  <View
                    style={
                      styles.legendaContainer
                    }
                  >
                    <View
                      style={[
                        styles.bolinhaLegenda,
                        {
                          backgroundColor:
                            FORD_COLORS.bluePrimary,
                        },
                      ]}
                    />

                    <Text
                      style={
                        styles.textoLegenda
                      }
                    >
                      ALVO
                    </Text>

                    <View
                      style={[
                        styles.bolinhaLegenda,
                        {
                          backgroundColor:
                            FORD_COLORS.raptorRed,
                          marginLeft: 16,
                        },
                      ]}
                    />

                    <Text
                      style={
                        styles.textoLegenda
                      }
                    >
                      RAPTOR
                    </Text>
                  </View>
                )}
              </View>
            )}

            {dadosRaptor &&
              dadosRaptor.veredito &&
              !carregandoRaptor && (
                <View
                  style={
                    styles.vereditoCard
                  }
                >
                  <Text
                    style={
                      styles.vereditoTitulo
                    }
                  >
                    VEREDITO DE ENGENHARIA -{' '}
                    {(
                      PERFIS_USO.find(
                        (p) =>
                          p.id ===
                          perfilUso
                      )?.nome ||
                      'USO URBANO'
                    ).split('/')[0]}
                  </Text>

                  <Text
                    style={
                      styles.vereditoTexto
                    }
                  >
                    {dadosRaptor.veredito}
                  </Text>

                  <TouchableOpacity
                    style={
                      styles.botaoAbrirDashboard
                    }
                    onPress={() =>
                      navigation.navigate(
                        'Radar',
                        {
                          marca,
                          modelo,
                          versao,
                          perfilUso,
                          dadosAlvo,
                          dadosRaptor,
                        }
                      )
                    }
                    activeOpacity={0.9}
                  >
                    <MaterialCommunityIcons
                      name="radar"
                      size={18}
                      color={
                        FORD_COLORS.white
                      }
                      style={{
                        marginRight: 8,
                      }}
                    />

                    <Text
                      style={
                        styles.botaoAbrirDashboardTexto
                      }
                    >
                      ABRIR RADAR ESTRATÉGICO
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

            <View
              style={
                styles.marcaDaguaContainer
              }
            >
              <MaterialCommunityIcons
                name="shield-check"
                size={12}
                color={
                  FORD_COLORS.chrome
                }
              />

              <Text
                style={
                  styles.marcaDagua
                }
              >
                DADOS PROCESSADOS - INTEL
                FORD P&D
              </Text>
            </View>
          </View>

          <View
            style={styles.acoesContainer}
          >
            {!dadosRaptor &&
              (marca !== 'Ford' ||
                !versao.includes(
                  'Raptor'
                )) &&
              !carregandoRaptor && (
                <TouchableOpacity
                  style={
                    styles.botaoRaptor
                  }
                  onPress={
                    compararComRaptor
                  }
                  activeOpacity={0.9}
                >
                  <MaterialCommunityIcons
                    name="sword-cross"
                    size={18}
                    color={
                      FORD_COLORS.white
                    }
                    style={{
                      marginRight: 10,
                    }}
                  />

                  <Text
                    style={
                      styles.botaoRaptorTexto
                    }
                  >
                    INICIAR DUELO DE PRODUTO
                  </Text>
                </TouchableOpacity>
              )}

            {dadosRaptor &&
              !carregandoRaptor && (
                <TouchableOpacity
                  style={
                    styles.botaoCompartilhar
                  }
                  onPress={
                    compartilharRelatorio
                  }
                  activeOpacity={0.9}
                >
                  <MaterialCommunityIcons
                    name="export-variant"
                    size={18}
                    color={
                      FORD_COLORS.white
                    }
                    style={{
                      marginRight: 10,
                    }}
                  />

                  <Text
                    style={
                      styles.botaoCompartilharTexto
                    }
                  >
                    EXPORTAR DADOS (PDF/IMG)
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: FORD_COLORS.bgLight,
    alignItems: 'center',
    paddingBottom: 50,
  },

  fordHeader: {
    flexDirection: 'row',
    backgroundColor: FORD_COLORS.blueDark,
    borderRadius: 4,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: FORD_COLORS.bluePrimary,
    elevation: 4,
  },

  headerIconBg: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 4,
    marginRight: 16,
  },

  fordTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: FORD_COLORS.white,
    letterSpacing: 1,
  },

  fordSub: {
    fontSize: 10,
    color: FORD_COLORS.chrome,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },

  perfilUsoContainer: {
    width: '100%',
    marginBottom: 24,
  },

  labelInput: {
    fontSize: 11,
    fontWeight: '900',
    color: FORD_COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  perfilRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  perfilBotao: {
    flex: 1,
    backgroundColor: FORD_COLORS.white,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 1,
  },

  perfilBotaoAtivo: {
    backgroundColor:
      FORD_COLORS.bluePrimary,
    borderColor: FORD_COLORS.blueDark,
    elevation: 3,
  },

  perfilTexto: {
    fontSize: 10,
    color: FORD_COLORS.bluePrimary,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  perfilTextoAtivo: {
    color: FORD_COLORS.white,
  },

  dropdownContainer: {
    width: '100%',
    marginBottom: 16,
  },

  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: FORD_COLORS.white,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    borderRadius: 4,
    padding: 16,
    elevation: 1,
  },

  dropdownBloqueado: {
    backgroundColor: FORD_COLORS.bgLight,
  },

  dropdownTexto: {
    fontSize: 13,
    color: FORD_COLORS.textPrimary,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  dropdownLista: {
    backgroundColor: FORD_COLORS.white,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
  },

  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: FORD_COLORS.bgLight,
  },

  dropdownItemTexto: {
    fontSize: 13,
    color: FORD_COLORS.textPrimary,
    fontWeight: '700',
  },

  botaoPrincipal: {
    flexDirection: 'row',
    backgroundColor: FORD_COLORS.blueDark,
    borderRadius: 4,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 24,
    elevation: 4,
  },

  botaoPrincipalTexto: {
    color: FORD_COLORS.white,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: FORD_COLORS.white,
    padding: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    width: '100%',
  },

  loadingTexto: {
    color: FORD_COLORS.bluePrimary,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },

  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FORD_COLORS.white,
    padding: 30,
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    borderStyle: 'dashed',
    borderRadius: 4,
  },

  emptyStateTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: FORD_COLORS.textPrimary,
    letterSpacing: 1,
  },

  emptyStateSub: {
    fontSize: 11,
    color: FORD_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
  },

  resultadoGeralWrapper: {
    width: '100%',
  },

  gifContainer: {
    width: '100%',
    backgroundColor: FORD_COLORS.white,
    borderRadius: 4,
    padding: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    elevation: 2,
  },

  gifImagem: {
    width: '100%',
    height: 160,
    borderRadius: 2,
  },

  gifLegendaBox: {
    marginTop: 8,
    backgroundColor: FORD_COLORS.bgLight,
    paddingVertical: 6,
    borderRadius: 2,
  },

  gifLegenda: {
    textAlign: 'center',
    fontSize: 10,
    color: FORD_COLORS.blueDark,
    fontWeight: '900',
    letterSpacing: 1,
  },

  tabelaContainerExport: {
    backgroundColor: FORD_COLORS.white,
    borderRadius: 4,
    padding: 20,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    elevation: 2,
  },

  tabelaHeaderGlobal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  tabelaTituloGlobal: {
    fontSize: 14,
    fontWeight: '900',
    color: FORD_COLORS.blueDark,
    textAlign: 'center',
    letterSpacing: 1,
    marginLeft: 8,
  },

  tabelaLinha: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    minHeight: 45,
    paddingHorizontal: 4,
  },

  linhaHeader: {
    borderBottomWidth: 2,
    borderBottomColor: FORD_COLORS.chrome,
    paddingVertical: 12,
    backgroundColor: FORD_COLORS.bgLight,
  },

  textoHeader: {
    fontWeight: '900',
    fontSize: 10,
    textAlign: 'left',
    color: FORD_COLORS.textSecondary,
    letterSpacing: 0.5,
  },

  textoHeaderVeiculo: {
    fontWeight: '900',
    fontSize: 11,
    textAlign: 'center',
    color: FORD_COLORS.blueDark,
    letterSpacing: 0.5,
  },

  textoHeaderRaptor: {
    fontWeight: '900',
    fontSize: 11,
    textAlign: 'center',
    color: FORD_COLORS.raptorRed,
    letterSpacing: 0.5,
  },

  celula: {
    fontSize: 11,
    color: FORD_COLORS.textPrimary,
    textAlign: 'left',
    paddingHorizontal: 4,
  },

  atributoLabel: {
    fontWeight: '800',
    color: FORD_COLORS.textSecondary,
  },

  boxValor: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 2,
    marginHorizontal: 2,
    justifyContent: 'center',
  },

  linhaPreco: {
    backgroundColor: '#F0FDF4',
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
  },

  textoPreco: {
    fontWeight: '900',
    color: '#166534',
    textAlign: 'center',
  },

  textoPrecoRaptor: {
    fontWeight: '900',
    color: FORD_COLORS.raptorRed,
    textAlign: 'center',
  },

  radarContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: FORD_COLORS.chrome,
  },

  radarTitulo: {
    fontSize: 11,
    fontWeight: '900',
    color: FORD_COLORS.blueDark,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },

  barraContainer: {
    marginBottom: 14,
  },

  barraLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: FORD_COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  barraLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  barraValorTexto: {
    width: 24,
    fontSize: 11,
    fontWeight: '900',
    color: FORD_COLORS.bluePrimary,
  },

  barraTrilho: {
    flex: 1,
    height: 8,
    backgroundColor: FORD_COLORS.chrome,
    borderRadius: 2,
    overflow: 'hidden',
  },

  barraPreenchimento: {
    height: '100%',
    borderRadius: 2,
  },

  legendaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },

  bolinhaLegenda: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 6,
  },

  textoLegenda: {
    fontSize: 9,
    color: FORD_COLORS.textSecondary,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  vereditoCard: {
    backgroundColor: FORD_COLORS.white,
    padding: 18,
    borderRadius: 4,
    marginTop: 24,
    borderWidth: 1,
    borderColor: FORD_COLORS.chrome,
    borderLeftWidth: 4,
    borderLeftColor:
      FORD_COLORS.bluePrimary,
  },

  vereditoTitulo: {
    color: FORD_COLORS.blueDark,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  vereditoTexto: {
    color: FORD_COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 20,
    fontStyle: 'italic',
    fontWeight: '600',
  },

  botaoAbrirDashboard: {
    flexDirection: 'row',
    backgroundColor:
      FORD_COLORS.bluePrimary,
    borderRadius: 4,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  botaoAbrirDashboardTexto: {
    color: FORD_COLORS.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  marcaDaguaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: FORD_COLORS.chrome,
  },

  marcaDagua: {
    textAlign: 'center',
    fontSize: 9,
    color: FORD_COLORS.textSecondary,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 6,
  },

  acoesContainer: {
    marginTop: 16,
    width: '100%',
  },

  botaoRaptor: {
    flexDirection: 'row',
    backgroundColor: FORD_COLORS.raptorRed,
    borderRadius: 4,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  botaoRaptorTexto: {
    color: FORD_COLORS.white,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },

  botaoCompartilhar: {
    flexDirection: 'row',
    backgroundColor: FORD_COLORS.success,
    borderRadius: 4,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  botaoCompartilharTexto: {
    color: FORD_COLORS.white,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
});