import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot'; 
import * as Sharing from 'expo-sharing'; 

const GROQ_API_KEY = ' --- ';

const FORD_COLORS = {
  bluePrimary: '#003478', blueDark: '#001A3F', chrome: '#D1D5DB', bgLight: '#F3F4F6', white: '#FFFFFF', textPrimary: '#111827', textSecondary: '#4B5563', raptorRed: '#E51937', success: '#10B981', danger: '#EF4444'
};

const BANCO_GIFS = {
  'Ranger': require('../../assets/gifs/ranger.gif'), 'Hilux': require('../../assets/gifs/hilux.gif'), 'S10': require('../../assets/gifs/s10.gif'), 'Amarok': require('../../assets/gifs/amarok.gif'), 'Frontier': require('../../assets/gifs/frontier.gif'), 'Triton': require('../../assets/gifs/triton.gif'), 'Rampage': require('../../assets/gifs/rampage.gif'), '1500': require('../../assets/gifs/1500.gif'), 'Silverado': require('../../assets/gifs/silverado.gif'), 'F-150': require('../../assets/gifs/f150.gif'), 'Maverick': require('../../assets/gifs/maverick.gif')
};

const GABARITO_RAPTOR = {
  "Preço Estimado Atual (R$)": "R$ 499.000", "Potência (cv)": "397 cv", "Torque (kgfm)": "59,4 kgfm", "Motorização": "3.0 V6 Bi-Turbo Gasolina", "Transmissão/Câmbio": "Automática de 10 mudanças", "Tração": "4WD (4x4 Avançado)", "Capacidade de Carga (kg)": "736 kg", "Suspensão/Amortecedores": "Amortecedores Fox 2.5 Live Valve", "Ângulo de Ataque": "32 graus", "Modos de Condução": "7 modos"
};

const SCORES_RAPTOR = { tecnologia: 9, forca: 9, offRoad: 10, custoBeneficio: 5 };

export default function RadarScreen({ route, navigation }) {
  const { marca, modelo, versao, dadosAlvo, dadosRaptor } = route.params || {};
  
  const [analiseTatica, setAnaliseTatica] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvoNoCofre, setSalvoNoCofre] = useState(false); 
  const viewRef = useRef();

  useEffect(() => {
    if (marca && modelo) { executarMotorInteligencia(); } else { Alert.alert('Erro', 'Alvo indefinido.'); navigation.goBack(); }
  }, []);

  const executarMotorInteligencia = async () => {
    setCarregando(true);
    const specsAlvo = dadosAlvo?.especificacoes ? JSON.stringify(dadosAlvo.especificacoes) : "Indisponível";
    const vereditoAtual = dadosRaptor?.veredito || "Sem veredito";

    const prompt = `Atue como Engenheiro Chefe de P&D da Ford.
    Analise o duelo entre a Ford Ranger Raptor e o seguinte alvo: ${marca} ${modelo} ${versao}.
    Dados Técnicos do Alvo coletados: ${specsAlvo}
    Veredito preliminar de vendas: ${vereditoAtual}

    Sua missão é gerar um relatório estruturado em JSON com as seguintes chaves:
    1. "scoresAmeaca": Notas de 0 a 10 indicando a força do ALVO em: "tecnologia", "forca", "offRoad", "custoBeneficio".
    2. "matrizLacunas": Array com 5 itens de equipamentos estratégicos. Para cada um indique "equipamento" (string), "concorrenteTem" (boolean) e "raptorTem" (boolean).
    3. "diretrizNextGen": Crie uma diretriz dinâmica de P&D de até 3 linhas baseada ESTRITAMENTE nos dados acima. Diga exatamente o que a engenharia da Ford precisa melhorar, adicionar ou baratear na próxima Raptor para aniquilar as vantagens técnicas deste alvo específico.

    Retorne APENAS o JSON válido no seguinte formato de exemplo:
    {
      "scoresAmeaca": { "tecnologia": 8, "forca": 7, "offRoad": 6, "custoBeneficio": 8 },
      "matrizLacunas": [ { "equipamento": "Exemplo", "concorrenteTem": true, "raptorTem": false } ],
      "diretrizNextGen": "Texto dinâmico aqui."
    }`;

    try {
      const resposta = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({ model: 'openai/gpt-oss-20b', response_format: { type: "json_object" }, messages: [{ role: 'system', content: 'Retorne JSON.' }, { role: 'user', content: prompt }], temperature: 0.2, max_tokens: 1000 })
      });
      const dados = await resposta.json();
      setAnaliseTatica(JSON.parse(dados.choices[0].message.content));
    } catch (e) {
      Alert.alert('Falha Tática', 'Erro de conexão.'); navigation.goBack();
    } finally {
      setCarregando(false);
    }
  };

  const salvarDashboardCofre = async () => {
    if (salvoNoCofre) return; 
    try {
      const novoItem = { id: `radar_${Date.now()}`, data: new Date().toLocaleString('pt-BR'), alvoNome: `${marca} ${modelo} (Radar)`, comparouRaptor: true, dadosAlvoCompleto: dadosAlvo, dadosRaptorCompleto: dadosRaptor, analiseTaticaCompleta: analiseTatica };
      const historicoSalvo = await AsyncStorage.getItem('historico_pesquisas');
      const arrayHistorico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
      await AsyncStorage.setItem('historico_pesquisas', JSON.stringify([novoItem, ...arrayHistorico]));
      setSalvoNoCofre(true); Alert.alert('SUCESSO', 'Arquivado no Cofre de Engenharia.');
    } catch (e) { Alert.alert('Erro', 'Falha ao salvar.'); }
  };

  const compartilharDashboard = async () => {
    try {
      const uri = await captureRef(viewRef, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, { dialogTitle: 'Enviar Dossiê Executivo' });
    } catch (erro) { Alert.alert('Erro', 'Falha na exportação.'); }
  };

  const renderBarraAmeaca = (label, scoreAlvo, scoreRaptor) => {
    const isAmeaca = scoreAlvo >= scoreRaptor;
    const corAlvo = isAmeaca ? FORD_COLORS.danger : FORD_COLORS.bluePrimary;
    return (
      <View style={styles.barraContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={styles.barraLabel}>{label}</Text>
          {isAmeaca && <Text style={styles.alertaAmeaca}>⚠️ AMEAÇA DETECTADA</Text>}
        </View>
        <View style={styles.barraLinha}>
          <Text style={styles.barraValorTextoRaptor}>{scoreRaptor}</Text>
          <View style={styles.barraTrilho}><View style={[styles.barraPreenchimento, { width: `${scoreRaptor * 10}%`, backgroundColor: FORD_COLORS.blueDark }]} /></View>
          <Text style={styles.tagBarra}>RAPTOR</Text>
        </View>
        <View style={[styles.barraLinha, { marginTop: 6 }]}>
          <Text style={[styles.barraValorTexto, { color: corAlvo }]}>{scoreAlvo}</Text>
          <View style={styles.barraTrilho}><View style={[styles.barraPreenchimento, { width: `${scoreAlvo * 10}%`, backgroundColor: corAlvo }]} /></View>
          <Text style={styles.tagBarra}>ALVO</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      
      <View style={styles.fordHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={FORD_COLORS.white} />
        </TouchableOpacity>
        
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.headerIconBg}>
            <MaterialCommunityIcons name="radar" size={22} color={FORD_COLORS.white} />
          </View>
          <View>
            <Text style={styles.fordTitle}>RADAR ESTRATÉGICO</Text>
            <Text style={styles.fordSub}>ALVO: {marca?.toUpperCase()} {modelo?.toUpperCase()}</Text>
          </View>
        </View>

        {!carregando && analiseTatica && (
          <TouchableOpacity onPress={salvarDashboardCofre} style={styles.btnSalvarHeader} activeOpacity={0.7}>
            <Ionicons name={salvoNoCofre ? "bookmark" : "bookmark-outline"} size={22} color={salvoNoCofre ? FORD_COLORS.success : FORD_COLORS.white} />
          </TouchableOpacity>
        )}
      </View>

      {BANCO_GIFS[modelo] && (
        <View style={styles.gifContainer}>
          <Image source={BANCO_GIFS[modelo]} style={styles.gifImagem} resizeMode="cover" />
          <View style={styles.gifLegendaBox}>
            <Text style={styles.gifLegenda}>ALVO CONFIRMADO: {marca.toUpperCase()} {modelo.toUpperCase()}</Text>
          </View>
        </View>
      )}

      {carregando && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={FORD_COLORS.bluePrimary} style={{marginBottom: 16}} />
          <Text style={styles.loadingTexto}>PROCESSANDO DADOS DE P&D...</Text>
          <Text style={styles.loadingSub}>Avaliando vetor de ameaça.</Text>
        </View>
      )}

      {analiseTatica && !carregando && (
        <View ref={viewRef} collapsable={false} style={styles.resultadosWrapper}>
          
          {dadosAlvo && (
            <View style={styles.cardModulo}>
              <View style={styles.moduloHeader}>
                <MaterialCommunityIcons name="clipboard-text" size={18} color={FORD_COLORS.blueDark} />
                <Text style={styles.moduloTitulo}>1. FICHA TÉCNICA BASE</Text>
              </View>
              
              <View style={styles.tabelaContainerExport}>
                <View style={[styles.tabelaLinha, styles.linhaHeader]}>
                  <Text style={[styles.celula, styles.textoHeader, { flex: 1.2 }]}>ATRIBUTO</Text>
                  <Text style={[styles.celula, styles.textoHeaderVeiculo, { flex: 1 }]}>ALVO</Text>
                  {dadosRaptor && <Text style={[styles.celula, styles.textoHeaderRaptor, { flex: 1 }]}>RAPTOR</Text>}
                </View>
                {dadosAlvo.especificacoes.map((item, index) => {
                  const valorFixoRaptor = GABARITO_RAPTOR[item.atributo] || "N/A";
                  const isPreco = item.atributo.toLowerCase().includes('preço');
                  const zebraStyle = index % 2 === 0 ? { backgroundColor: '#FFFFFF' } : { backgroundColor: '#F9FAFB' };
                  return (
                    <View key={index} style={[styles.tabelaLinha, zebraStyle, isPreco && styles.linhaPreco]}>
                      <Text style={[styles.celula, styles.atributoLabel, { flex: 1.2 }]}>{item.atributo.toUpperCase()}</Text>
                      <View style={[styles.boxValor, { flex: 1 }]}><Text style={[styles.celula, isPreco && styles.textoPreco]}>{item.valor.toUpperCase()}</Text></View>
                      {dadosRaptor && <View style={[styles.boxValor, { flex: 1, backgroundColor: isPreco ? '#FEF2F2' : 'transparent' }]}><Text style={[styles.celula, isPreco && styles.textoPrecoRaptor]}>{valorFixoRaptor.toUpperCase()}</Text></View>}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.cardModulo}>
            <View style={styles.moduloHeader}>
              <MaterialCommunityIcons name="chart-bar" size={18} color={FORD_COLORS.blueDark} />
              <Text style={styles.moduloTitulo}>2. MAPA DE AMEAÇAS</Text>
            </View>
            <View style={{ marginTop: 12 }}>
              {renderBarraAmeaca('TECNOLOGIA EMBARCADA', analiseTatica.scoresAmeaca.tecnologia, SCORES_RAPTOR.tecnologia)}
              {renderBarraAmeaca('FORÇA BRUTA E MOTOR', analiseTatica.scoresAmeaca.forca, SCORES_RAPTOR.forca)}
              {renderBarraAmeaca('CAPACIDADE OFF-ROAD', analiseTatica.scoresAmeaca.offRoad, SCORES_RAPTOR.offRoad)}
              {renderBarraAmeaca('CUSTO-BENEFÍCIO', analiseTatica.scoresAmeaca.custoBeneficio, SCORES_RAPTOR.custoBeneficio)}
            </View>
          </View>

          <View style={styles.cardModulo}>
            <View style={styles.moduloHeader}>
              <MaterialCommunityIcons name="grid" size={18} color={FORD_COLORS.blueDark} />
              <Text style={styles.moduloTitulo}>3. MATRIZ DE LACUNAS (WHITE-SPACE)</Text>
            </View>
            <View style={styles.tabelaContainer}>
              <View style={[styles.tabelaLinhaMatriz, styles.linhaHeaderMatriz]}>
                <Text style={[styles.celula, styles.textoHeaderMatriz, { flex: 1.5 }]}>EQUIPAMENTO</Text>
                <Text style={[styles.celula, styles.textoHeaderCenter, { flex: 0.8 }]}>ALVO</Text>
                <Text style={[styles.celula, styles.textoHeaderCenter, { flex: 0.8 }]}>RAPTOR</Text>
              </View>
              {analiseTatica.matrizLacunas.map((item, index) => {
                const isWarning = item.concorrenteTem && !item.raptorTem; 
                return (
                  <View key={index} style={[styles.tabelaLinhaMatriz, isWarning && styles.linhaAlerta]}>
                    <Text style={[styles.celula, styles.textoItemGrid, { flex: 1.5 }]}>{item.equipamento.toUpperCase()}</Text>
                    <View style={[styles.boxIcone, { flex: 0.8 }]}>{item.concorrenteTem ? <Ionicons name="checkmark" size={18} color={FORD_COLORS.success} /> : <Ionicons name="close" size={18} color={FORD_COLORS.chrome} />}</View>
                    <View style={[styles.boxIcone, { flex: 0.8 }]}>{item.raptorTem ? <Ionicons name="checkmark" size={18} color={FORD_COLORS.bluePrimary} /> : <Ionicons name="close" size={18} color={FORD_COLORS.chrome} />}</View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={[styles.cardModulo, { borderColor: FORD_COLORS.bluePrimary, borderLeftWidth: 4 }]}>
            <View style={styles.moduloHeader}>
              <MaterialCommunityIcons name="lightbulb-on" size={18} color={FORD_COLORS.bluePrimary} />
              <Text style={[styles.moduloTitulo, { color: FORD_COLORS.bluePrimary }]}>4. DIRETRIZ NEXT-GEN</Text>
            </View>
            <View style={styles.caixaDiretriz}>
              <Text style={styles.textoDiretriz}>{analiseTatica.diretrizNextGen}</Text>
            </View>
          </View>
          
          <View style={styles.marcaDaguaContainer}>
            <MaterialCommunityIcons name="lock" size={10} color={FORD_COLORS.textSecondary} />
            <Text style={styles.marcaDagua}>USO RESTRITO P&D FORD ({new Date().toLocaleDateString('pt-BR')})</Text>
          </View>

        </View>
      )}

      {analiseTatica && !carregando && (
        <View style={styles.acoesContainer}>
          <TouchableOpacity style={styles.botaoCompartilhar} onPress={compartilharDashboard} activeOpacity={0.9}>
            <MaterialCommunityIcons name="export" size={18} color={FORD_COLORS.white} style={{marginRight: 8}} />
            <Text style={styles.botaoCompartilharTexto}>EXPORTAR DOSSIÊ EXECUTIVO</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: FORD_COLORS.bgLight, alignItems: 'center', paddingBottom: 50 },
  fordHeader: { flexDirection: 'row', backgroundColor: FORD_COLORS.blueDark, borderRadius: 4, padding: 18, width: '100%', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderLeftWidth: 4, borderLeftColor: FORD_COLORS.raptorRed, elevation: 4 },
  btnVoltar: { paddingRight: 12 }, btnSalvarHeader: { paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.2)' },
  headerIconBg: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 4, marginRight: 10 },
  fordTitle: { fontSize: 16, fontWeight: '900', color: FORD_COLORS.white, letterSpacing: 1 }, fordSub: { fontSize: 10, color: FORD_COLORS.chrome, fontWeight: '700', marginTop: 2, letterSpacing: 0.5 },
  
  gifContainer: { width: '100%', backgroundColor: FORD_COLORS.white, borderRadius: 4, padding: 8, marginBottom: 20, borderWidth: 1, borderColor: FORD_COLORS.chrome, elevation: 2 },
  gifImagem: { width: '100%', height: 160, borderRadius: 2 }, gifLegendaBox: { marginTop: 8, backgroundColor: FORD_COLORS.bgLight, paddingVertical: 6, borderRadius: 2 }, gifLegenda: { textAlign: 'center', fontSize: 10, color: FORD_COLORS.blueDark, fontWeight: '900', letterSpacing: 1 },
  
  loadingContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: FORD_COLORS.white, padding: 40, borderRadius: 4, borderWidth: 1, borderColor: FORD_COLORS.chrome, width: '100%' }, 
  loadingTexto: { color: FORD_COLORS.blueDark, fontWeight: '900', fontSize: 13, marginBottom: 4, letterSpacing: 0.5 }, loadingSub: { color: FORD_COLORS.textSecondary, fontWeight: '700', fontSize: 10, letterSpacing: 0.5 },
  
  resultadosWrapper: { width: '100%', backgroundColor: FORD_COLORS.bgLight },
  cardModulo: { backgroundColor: FORD_COLORS.white, borderRadius: 4, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: FORD_COLORS.chrome, elevation: 2 },
  moduloHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 }, moduloTitulo: { fontSize: 13, fontWeight: '900', color: FORD_COLORS.blueDark, letterSpacing: 1, marginLeft: 8 }, moduloDescricao: { fontSize: 11, color: FORD_COLORS.textSecondary, fontWeight: '600', marginBottom: 16, lineHeight: 16 },
  
  tabelaContainerExport: { borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: FORD_COLORS.chrome }, 
  tabelaLinha: { flexDirection: 'row', paddingVertical: 10, alignItems: 'center', minHeight: 40, paddingHorizontal: 4 }, linhaHeader: { borderBottomWidth: 2, borderBottomColor: FORD_COLORS.chrome, paddingVertical: 10, backgroundColor: FORD_COLORS.bgLight }, 
  textoHeader: { fontWeight: '900', fontSize: 10, textAlign: 'left', color: FORD_COLORS.textSecondary, letterSpacing: 0.5, marginLeft: 4 }, textoHeaderVeiculo: { fontWeight: '900', fontSize: 10, textAlign: 'center', color: FORD_COLORS.blueDark, letterSpacing: 0.5 }, textoHeaderRaptor: { fontWeight: '900', fontSize: 10, textAlign: 'center', color: FORD_COLORS.raptorRed, letterSpacing: 0.5 },
  celula: { fontSize: 10, color: FORD_COLORS.textPrimary, textAlign: 'left', paddingHorizontal: 4 }, atributoLabel: { fontWeight: '800', color: FORD_COLORS.textSecondary, marginLeft: 4 }, boxValor: { flex: 1, paddingVertical: 6, paddingHorizontal: 4, borderRadius: 2, marginHorizontal: 2, justifyContent: 'center' }, 
  linhaPreco: { backgroundColor: '#F0FDF4', borderTopWidth: 1, borderTopColor: '#DCFCE7' }, textoPreco: { fontWeight: '900', color: '#166534', textAlign: 'center' }, textoPrecoRaptor: { fontWeight: '900', color: FORD_COLORS.raptorRed, textAlign: 'center' },
  
  barraContainer: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: FORD_COLORS.bgLight }, 
  barraLabel: { fontSize: 10, fontWeight: '900', color: FORD_COLORS.textPrimary, letterSpacing: 0.5 }, alertaAmeaca: { fontSize: 8, fontWeight: '900', color: FORD_COLORS.danger, backgroundColor: '#FEF2F2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2 },
  barraLinha: { flexDirection: 'row', alignItems: 'center' }, barraValorTexto: { width: 22, fontSize: 11, fontWeight: '900' }, barraValorTextoRaptor: { width: 22, fontSize: 11, fontWeight: '900', color: FORD_COLORS.blueDark }, 
  barraTrilho: { flex: 1, height: 8, backgroundColor: FORD_COLORS.chrome, borderRadius: 2, overflow: 'hidden' }, barraPreenchimento: { height: '100%', borderRadius: 2 }, tagBarra: { width: 45, fontSize: 8, fontWeight: '900', color: FORD_COLORS.textSecondary, textAlign: 'right', marginLeft: 6 },
  
  tabelaContainer: { borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: FORD_COLORS.chrome },
  tabelaLinhaMatriz: { flexDirection: 'row', paddingVertical: 10, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: FORD_COLORS.bgLight, backgroundColor: FORD_COLORS.white }, linhaHeaderMatriz: { backgroundColor: FORD_COLORS.bgLight, borderBottomWidth: 2, borderBottomColor: FORD_COLORS.chrome, flexDirection: 'row', paddingVertical: 10 }, linhaAlerta: { backgroundColor: '#FEF2F2' }, 
  textoHeaderMatriz: { fontWeight: '900', fontSize: 9, color: FORD_COLORS.textSecondary, letterSpacing: 0.5, paddingLeft: 12 }, textoHeaderCenter: { fontWeight: '900', fontSize: 9, textAlign: 'center', color: FORD_COLORS.textSecondary, letterSpacing: 0.5 }, textoItemGrid: { fontSize: 10, fontWeight: '800', color: FORD_COLORS.textPrimary, paddingLeft: 12, lineHeight: 14 }, boxIcone: { alignItems: 'center', justifyContent: 'center' },
  
  caixaDiretriz: { backgroundColor: '#FFFBEB', padding: 16, borderRadius: 4, borderWidth: 1, borderColor: '#FEF3C7' }, textoDiretriz: { fontSize: 12, fontWeight: '700', color: '#92400E', lineHeight: 18, fontStyle: 'italic' },
  marcaDaguaContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 16 }, marcaDagua: { textAlign: 'center', fontSize: 9, color: FORD_COLORS.textSecondary, fontWeight: '900', letterSpacing: 1, marginLeft: 6 },
  
  acoesContainer: { width: '100%', marginTop: 8 },
  botaoCompartilhar: { flexDirection: 'row', backgroundColor: FORD_COLORS.success, borderRadius: 4, padding: 16, width: '100%', alignItems: 'center', justifyContent: 'center', elevation: 4 }, botaoCompartilharTexto: { color: FORD_COLORS.white, fontSize: 13, fontWeight: '900', letterSpacing: 1 }
});