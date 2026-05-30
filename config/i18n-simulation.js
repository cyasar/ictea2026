/** Simulation Mode UI — EN / TR / RO (optimization method help) */
window.SIM_I18N = {
  en: {
    langLabel: "Language",
    methodLabel: "Optimization method",
    methods: {
      exhaustive: "Exhaustive search",
      simulated_annealing: "Simulated annealing",
      ising_mean_field: "Ising mean field",
    },
    methodHelpTitle: "What this method does",
    methodHelp: {
      exhaustive:
        "Checks every binary pattern (2ⁿ states). Finds the exact global minimum of H(x) — best for small networks (n ≤ 20, e.g. six-pore benchmark with 64 states). Too slow for large networks (6×8 = 48 vars → 2⁴⁸).",
      simulated_annealing:
        "Classical heuristic: randomly flips pore on/off while “cooling” the system. Quickly finds a low-energy, often feasible layout for large n. Same QUBO H(x); result is approximate but scales to 48+ variables.",
      ising_mean_field:
        "Classical spin-inspired solver: soft Ising variables descend the QUBO energy landscape. Fast and exploratory; good for large search spaces. Same H(x) as QUBO/quantum-annealing formulations — no quantum hardware used here.",
    },
  },
  tr: {
    langLabel: "Dil",
    methodLabel: "Optimizasyon yöntemi",
    methods: {
      exhaustive: "Exhaustive search (tüm tarama)",
      simulated_annealing: "Simulated annealing (benzetimli tavlama)",
      ising_mean_field: "Ising mean field (Ising ortalama alanı)",
    },
    methodHelpTitle: "Bu yöntem ne yapar?",
    methodHelp: {
      exhaustive:
        "Tüm ikili desenleri dener (2ⁿ durum). H(x) için kesin global minimumu bulur — küçük ağlar için ideal (n ≤ 20; altı gözenek = 64 durum). Büyük ağlarda (6×8 = 48 değişken → 2⁴⁸) çok yavaştır.",
      simulated_annealing:
        "Klasik sezgisel yöntem: gözenekleri rastgele aç/kapa, sistem “soğutulur”. Büyük n için hızlıca düşük enerjili, çoğu zaman uygulanabilir çözüm bulur. Aynı QUBO H(x); sonuç yaklaşık ama 48+ değişkene ölçeklenir.",
      ising_mean_field:
        "Klasik spin-esinli çözücü: yumuşak Ising değişkenleri QUBO enerji manzarasında iner. Hızlı ve keşif odaklı; büyük arama uzayları için uygundur. Kuantum-annealing ile aynı H(x) formülasyonu — burada kuantum donanımı yoktur.",
    },
  },
  ro: {
    langLabel: "Limbă",
    methodLabel: "Metodă de optimizare",
    methods: {
      exhaustive: "Căutare exhaustivă",
      simulated_annealing: "Simulated annealing (recuire simulată)",
      ising_mean_field: "Ising mean field (câmp mediu Ising)",
    },
    methodHelpTitle: "Ce face această metodă",
    methodHelp: {
      exhaustive:
        "Verifică fiecare pattern binar (2ⁿ stări). Găsește minimul global exact al H(x) — ideal pentru rețele mici (n ≤ 20; șase pori = 64 stări). Prea lent pentru rețele mari (6×8 = 48 variabile → 2⁴⁸).",
      simulated_annealing:
        "Euristică clasică: comută pori aleator, „răcind” sistemul. Găsește rapid un layout cu energie scăzută, adesea fezabil, pentru n mare. Același H(x) QUBO; rezultat aproximativ, dar scalează la 48+ variabile.",
      ising_mean_field:
        "Solver clasic inspirat Ising: variabile spin moi coboară peisajul energetic QUBO. Rapid, explorator; potrivit pentru spații mari de căutare. Aceeași formulare H(x) ca quantum annealing — fără hardware cuantic aici.",
    },
  },
};
