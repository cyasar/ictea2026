/** Presentation mode translations — EN / TR / RO (24 slides: title + p4 summary + p2 visuals) */
window.PRES_I18N = {
  en: {
    ui: {
      exit: "Exit",
      prev: "← Previous",
      next: "Next →",
      speakerNotes: "Speaker Notes",
      notesHide: "Hide Notes",
      slideCounter: "Slide",
      notesLangHint: "Notes match presentation language (EN / TR / RO)",
      authorsTop: "Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Software Development)",
      authorsSlide: "Prof. Dr. Eden Mamut<br>Dr. Cumali Yaşar — Software Development",
      authorsFooter: "Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Software Development)",
      langLabel: "Language",
      liveSimulation: "Live Simulation",
      backToSlides: "← Back to Slides",
      runOptimization: "Run Optimization",
      simHint: "Press Run Optimization or key S to toggle simulation",
      active: "Active",
      feasible: "Feasible",
    },
    slides: [
      {
        title: "Optimization of Oxygen Flow in Nanoporous Networks Using a Quantum Ising Machine",
        subtitle: "A QUBO-Based Approach for Sustainable Water De-Eutrophication",
        body: [],
        note: "Core question: Is it enough to simply add oxygen into water, or must we also optimize through which pores, under which pressure, and with what flow continuity oxygen is delivered? We focus on the second approach — controlled, efficient delivery to the target zone under physical constraints. No quantum advantage is claimed; QUBO is a structured binary optimization framework.",
      },
      {
        title: "Problem Statement",
        body: [
          "Eutrophic systems → oxygen-deficient bottom layers",
          "O₂ at sediment–water interface is critical",
          "Nanoporous delivery needs more than aeration",
          "Efficiency, pressure, interaction & continuity together",
        ],
        note: "This study's problem statement: Is it enough to simply add oxygen into water, or must we also optimize through which pores, under which pressure, and with what flow continuity oxygen is delivered? We adopt the second approach — efficient, balanced delivery to the target zone under physical constraints.",
      },
      {
        title: "Research Hypothesis",
        body: [
          "Each pore → binary decision variable",
          "Feasible paths via Hamiltonian minimization",
          "Pore combinations, not isolated performance",
          "Ising-inspired route for larger design spaces",
        ],
        note: "Hypothesis: If each candidate pore is modeled as an active/inactive binary variable, a QUBO/Ising-compatible Hamiltonian can select efficient oxygen-transport pathways that respect pressure limits and flow continuity. Goal is not quantum superiority — it is a strong binary optimization language.",
      },
      {
        title: "Aim of the Study",
        body: [
          "Model pores as binary variables",
          "Reward efficient O₂ pathways",
          "Penalize pressure & disconnected paths",
          "Validate on six-pore benchmark",
          "Extend to multi-channel networks",
        ],
        note: "The aim is not to build an experimental device, but to transform nanoporous oxygen delivery into a computable optimization problem: binary pore variables, rewarded flow paths, penalized pressure and continuity violations.",
      },
      {
        title: "Method",
        body: [
          "1. Discrete flow network model",
          "2. Binary pore encoding",
          "3. QUBO Hamiltonian construction",
          "4. Six-pore exhaustive validation",
          "5. Multi-channel annealing & Ising search",
        ],
        note: "Five steps: model the nanoporous system as a discrete network; encode each pore as binary; place efficiency, pressure, active-pore count and continuity in the Hamiltonian; validate small systems with exhaustive search; use heuristic and Ising-inspired methods on larger networks.",
      },
      {
        title: "QUBO Model",
        body: [
          "H(x): efficiency reward + interaction",
          "Pressure & active-pore penalties",
          "Continuity penalty C(x)",
          "Lower H(x) → better architecture",
        ],
        note: "The Hamiltonian is the heart of the QUBO model. Lower energy means a better oxygen-transport architecture. High-efficiency paths are rewarded; pressure exceedance, excess pore activation and disconnected paths are penalized.",
      },
      {
        title: "Oxygen-Deficient Bottom Waters and Eutrophication",
        body: [
          "Algal blooms → hypoxic bottom layers",
          "Target: O₂ at sediment–water interface",
        ],
        note: "In eutrophic systems, bottom waters can become oxygen-deficient. Hypoxic sediments may sustain internal nutrient loading. Delivering oxygen to the sediment–water interface is therefore critical for restoration — not just surface aeration.",
      },
      {
        title: "Oxygen Micro/Nanobubbles as a Restoration Strategy",
        body: [
          "~100 nm · high transfer · slow rise",
          "Long residence · targeted O₂ delivery",
        ],
        note: "We chose this topic because oxygen nanobubbles offer strong potential for water restoration. But that potential only becomes a real advantage with the right channel and pore architecture — not uncontrolled bubbling.",
      },
      {
        title: "The Design Challenge: Which Pores Should Be Activated?",
        body: [
          "Balance efficiency, pressure, continuity",
          "Which subset is optimal?",
        ],
        note: "The central question: is aeration enough, or must we optimize pore selection, pressure limits, and flow continuity? Nanoporous delivery turns this into a constrained network design problem.",
      },
      {
        title: "Nanoporous Oxygen Delivery Architecture",
        body: [
          "O₂ inlet → microchannels → membrane",
          "Release at sediment–water interface",
        ],
        note: "Oxygen travels from the inlet through microchannels and the nanoporous membrane to the sediment–water interface. The physical stack defines where binary pore decisions matter.",
      },
      {
        title: "From Physical Pores to Binary Variables",
        body: [
          "xᵢ = 1 active · xᵢ = 0 passive",
        ],
        note: "Step one of the method: model the physical system as a discrete network. Each candidate pore becomes a binary decision variable. The design question reduces to: which pores should be active?",
      },
      {
        title: "QUBO Hamiltonian Formulation",
        body: [
          "Minimize H(x): reward flow, penalize constraints",
        ],
        note: "The Hamiltonian is the mathematical core. Lower H(x) means a better oxygen-transport architecture. High flow efficiency is rewarded; pressure violations, excess active pores, and disconnected paths are penalized. QUBO is used as a modeling language — not a claim of quantum superiority.",
      },
      {
        title: "From QUBO to Ising-Compatible Optimization",
        body: [
          "x = (1 + s) / 2  ·  s ∈ {−1, +1}",
        ],
        note: "Classical methods are excellent for small problems, but search space grows as 2ⁿ. QUBO reformulates the problem in binary form for classical, heuristic, Ising-inspired, or future quantum-compatible solvers — without claiming quantum advantage.",
      },
      {
        title: "Validation Case: Six-Pore Benchmark",
        body: [
          "6 pores · Pmax=0.80 · K=3",
          "Exhaustive search: 2⁶ = 64 states",
        ],
        note: "The six-pore benchmark is small but instructive. All 64 configurations can be checked with classical exhaustive search, enabling transparent validation of the QUBO logic.",
      },
      {
        title: "Optimal Feasible Configuration",
        body: [
          "Selected: {1, 2, 6}",
          "η = 2.35 · P = 0.80 · Feasible ✓",
        ],
        note: "Key finding: the best solution is not simply the highest individual-efficiency pores. The model evaluates pores together as a flow network. Pore 4 is efficient but may be excluded due to pressure or interaction effects.",
      },
      {
        title: "Network Effects Matter",
        body: [
          "High fᵢ alone may fail — pressure & connectivity decide",
        ],
        note: "A high-efficiency pore may still be excluded if it causes pressure exceedance, unfavorable hydraulic interaction, or disconnected pathways. System behavior is emergent — not additive.",
      },
      {
        title: "Scaling to Dynamic Multi-Channel Nanoporous Networks",
        body: [
          "6 × 8 = 48 binary variables",
          "Search space: 2⁴⁸ patterns",
        ],
        note: "As the network grows, the search space increases exponentially. Exhaustive search is no longer practical. The QUBO/Ising-compatible structure supports heuristic and energy-minimization solvers at scale.",
      },
      {
        title: "Optimization and Validation Strategy",
        body: [
          "Exhaustive · Simulated annealing · Ising-inspired",
        ],
        note: "Small networks: exhaustive search for exact validation. Larger networks: simulated annealing and Ising-inspired search. No quantum advantage is claimed — solvers remain classical or heuristic in this proof-of-concept.",
      },
      {
        title: "What Does This Framework Contribute?",
        body: [
          "Nanobubbles + QUBO/Ising optimization layer",
        ],
        note: "Aim: develop a computational optimization framework for feasible oxygen pathways in nanoporous networks — not to build a validated device yet. The framework can later integrate CFD, experiments, and realistic membrane geometry.",
      },
      {
        title: "Conclusion and Future Directions",
        body: [
          "QUBO selects feasible O₂ pathways",
          "Next: CFD · experiments · real geometry",
        ],
        note: "This is a proof-of-concept, not an experimentally validated device design. The main contribution is modeling oxygen transport as a structured binary optimization problem under pressure, efficiency, and continuity constraints. Future work: CFD, experimental pressure-flow data, realistic geometries.",
      },
      {
        title: "Key Findings",
        body: [
          "Classical naive {1,2,4} → infeasible (P=0.90)",
          "QUBO optimum {1, 2, 6} · η=2.35 · P=0.80",
          "Exhaustive · SA · Ising → same result",
          "See comparison table →",
        ],
        note: "Six-pore benchmark: classical greedy selection (top-3 by fᵢ) yields {1,2,4} with P=0.90 — exceeding Pmax. QUBO-based minimization of H(x) selects {1,2,6} as the feasible optimum. Exhaustive search, simulated annealing and Ising-compatible search all reach the same solution. No quantum hardware advantage is claimed.",
      },
      {
        title: "Interpretation of the Results",
        body: [
          "Optimum ≠ highest individual fᵢ alone",
          "Connectivity & hydraulic coupling matter",
          "High-efficiency pore may be excluded",
          "QUBO evaluates combinations",
        ],
        note: "Scientific meaning: highest-efficiency pores do not always form the best system solution. Network connectivity, pressure distribution and hydraulic interactions also decide. QUBO evaluates pore combinations, not isolated pores.",
      },
      {
        title: "Discussion",
        body: [
          "Proof-of-concept framework — no quantum advantage",
          "QUBO as structured binary language",
          "Does not replace CFD or experiments",
          "Future: CFD coefficients · lab data · geometry",
        ],
        note: "This study does not claim quantum superiority. QUBO is used because active/inactive pore selection is naturally binary and physically constrained. Future work must integrate CFD and experimental pressure-flow data.",
      },
      {
        title: "Conclusion",
        body: [
          "Constrained binary optimization formulation",
          "QUBO/Ising selects feasible O₂ pathways",
          "Six-pore benchmark confirms model logic",
          "Scalable multi-channel potential",
        ],
        note: "Conclusion: nanoporous oxygen delivery is reformulated as a physically constrained binary optimization problem. The six-pore example validates the logic; multi-channel extension shows scalability. Main contribution is an optimization language for environmental restoration — not a quantum superiority claim.",
      },
    ],
  },
  tr: {
    ui: {
      exit: "Çıkış",
      prev: "← Önceki",
      next: "Sonraki →",
      speakerNotes: "Konuşmacı Notları",
      notesHide: "Notları Gizle",
      slideCounter: "Slayt",
      notesLangHint: "Notlar sunum diliyle eşleşir (EN / TR / RO)",
      authorsTop: "Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Yazılım Geliştirme)",
      authorsSlide: "Prof. Dr. Eden Mamut<br>Dr. Cumali Yaşar — Yazılım Geliştirme",
      authorsFooter: "Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Yazılım Geliştirme)",
      langLabel: "Dil",
      liveSimulation: "Canlı Simülasyon",
      backToSlides: "← Slaytlara Dön",
      runOptimization: "Optimizasyonu Çalıştır",
      simHint: "Optimizasyonu çalıştırın veya S tuşu ile simülasyonu açın",
      active: "Aktif",
      feasible: "Uygulanabilir",
    },
    slides: [
      {
        title: "Nanoporlu Ağlarda Oksijen Akışının Kuantum Ising Makinesi Kullanılarak Optimizasyonu",
        subtitle: "Sürdürülebilir Su De-Ötrofikasyonu için QUBO Tabanlı Bir Yaklaşım",
        body: [],
        note: "Bu çalışmanın temel sorusu şudur: Oksijeni yalnızca suya vermek yeterli midir, yoksa oksijenin hangi gözeneklerden, hangi basınç altında ve hangi akış sürekliliğiyle taşınacağı da optimize edilmeli midir? Biz bu çalışmada ikinci yaklaşımı esas alıyoruz. Çünkü oksijenin hedef bölgeye verimli, kontrollü ve fiziksel kısıtları sağlayarak ulaşması gerekir. Kuantum üstünlüğü iddiası yoktur.",
      },
      {
        title: "Problem Cümlesi",
        body: [
          "Ötrofik sistemler → oksijensiz dip tabakalar",
          "Sediment–su arayüzüne O₂ kritik",
          "Nanoporlu iletim basit havalandırmadan fazlası",
          "Verim, basınç, etkileşim ve süreklilik birlikte",
        ],
        note: "Bu çalışmanın problem cümlesi şudur: Oksijeni yalnızca suya vermek yeterli midir, yoksa oksijenin hangi gözeneklerden, hangi basınç altında ve hangi akış sürekliliğiyle taşınacağı da optimize edilmeli midir? Bu çalışma ikinci yaklaşımı esas alır. Çünkü çevresel restorasyon açısından oksijenin hedef bölgeye verimli, dengeli ve fiziksel kısıtları sağlayacak şekilde ulaştırılması gerekir.",
      },
      {
        title: "Araştırma Hipotezi",
        body: [
          "Her gözenek → ikili karar değişkeni",
          "Hamiltonian minimizasyonu ile uygun yollar",
          "Gözenek kombinasyonları, tekil performans değil",
          "Büyük uzaylar için Ising-esinli rota",
        ],
        note: "Hipotezimiz şudur: Eğer nanoporlu ağdaki her aday gözenek aktif veya pasif bir karar değişkeni olarak modellenirse, QUBO/Ising uyumlu bir Hamiltonian fonksiyonu ile verimli, basınç sınırlarını aşmayan ve akış sürekliliğini koruyan uygun oksijen taşıma yolları seçilebilir. Burada amaç kuantum üstünlüğü iddia etmek değildir; amaç, problemi ikili optimizasyon diliyle güçlü ve düzenli biçimde ifade etmektir.",
      },
      {
        title: "Çalışmanın Amacı",
        body: [
          "Gözenekleri ikili değişken olarak modelle",
          "Verimli O₂ yollarını ödüllendir",
          "Basınç ve kopuk yolları cezalandır",
          "Altı gözenek benchmark ile doğrula",
          "Çok kanallı ağlara genişlet",
        ],
        note: "Çalışmanın amacı, deneysel bir cihaz üretmek değil; nanoporlu oksijen taşıma mimarisini hesaplanabilir bir optimizasyon problemine dönüştürmektir. Bu çerçevede aday gözenekler ikili değişkenlerle temsil edilir, verimli akış yolları ödüllendirilir, basınç ve süreklilik ihlalleri cezalandırılır.",
      },
      {
        title: "Yöntem",
        body: [
          "1. Ayrık akış ağı modeli",
          "2. İkili gözenek kodlaması",
          "3. QUBO Hamiltonian oluşturma",
          "4. Altı gözenek exhaustive doğrulama",
          "5. Çok kanallı tavlama & Ising araması",
        ],
        note: "Yöntem beş ana adımdan oluşur. Önce nanoporlu sistem ayrık bir akış ağı olarak modellenir. Sonra her gözenek aktif veya pasif bir ikili değişkenle ifade edilir. Daha sonra akış verimliliği, basınç, aktif gözenek sayısı ve süreklilik kısıtları Hamiltonian fonksiyonuna yerleştirilir. Küçük sistem exhaustive search ile doğrulanır; büyük ağlarda sezgisel ve Ising-esinli yöntemler kullanılır.",
      },
      {
        title: "QUBO Modeli",
        body: [
          "H(x): verim ödülü + etkileşim",
          "Basınç ve aktif gözenek cezaları",
          "Süreklilik cezası C(x)",
          "Düşük H(x) → daha iyi mimari",
        ],
        note: "QUBO modelinin kalbi Hamiltonian fonksiyonudur. Bu fonksiyon düşük enerjiye ulaştığında daha uygun bir oksijen taşıma mimarisi elde edilir. Yüksek verimli akış yolları ödüllendirilirken, basınç aşımı, fazla gözenek kullanımı ve kopuk akış yolları cezalandırılır.",
      },
      {
        title: "Oksijen Eksikliği ve Ötrofikasyon",
        body: [
          "Alg patlaması → hipoksik dip sular",
          "Hedef: sediment–su arayüzüne O₂",
        ],
        note: "Ötrofikasyon yaşayan sucul sistemlerde dip su tabakalarında oksijen azalabilir. Bu durumda sediment tabakası içsel besin yükünü sürdürebilir. Bu nedenle oksijeni doğrudan sediment-su arayüzüne ulaştırmak çevresel restorasyon açısından önemlidir.",
      },
      {
        title: "Restorasyon Stratejisi: Oksijen Mikro/Nanokabarcıkları",
        body: [
          "~100 nm · yüksek transfer · yavaş yükseliş",
          "Uzun kalış · hedefli oksijenlendirme",
        ],
        note: "Bu çalışmayı seçmemizin nedeni, oksijen nanokabarcıklarının su restorasyonu için güçlü bir potansiyel taşımasıdır. Ancak bu potansiyel, yalnızca doğru kanal ve gözenek mimarisiyle gerçek bir avantaja dönüşebilir.",
      },
      {
        title: "Tasarım Zorluğu: Hangi Gözenekler Aktif Olmalı?",
        body: [
          "Verim · basınç · süreklilik dengesi",
          "Optimal alt küme hangisi?",
        ],
        note: "Temel soru: Havalandırma yeterli mi, yoksa gözenek seçimi, basınç limitleri ve akış sürekliliği de optimize edilmeli mi? Nanoporlu iletim bunu kısıtlı bir ağ optimizasyon problemine dönüştürür.",
      },
      {
        title: "Nanoporlu Oksijen İletim Mimarisi",
        body: [
          "O₂ girişi → mikrokanallar → membran",
          "Sediment–su arayüzünde salınım",
        ],
        note: "Oksijen giriş bölgesinden mikrokanallar ve membran aracılığıyla sediment-su arayüzüne taşınır. Fiziksel katmanlar, ikili gözenek kararlarının nerede anlam kazandığını tanımlar.",
      },
      {
        title: "Fiziksel Gözeneklerden İkili Değişkenlere",
        body: ["xᵢ = 1 aktif · xᵢ = 0 pasif"],
        note: "Yöntemin ilk adımı fiziksel sistemi ayrık bir ağ olarak modellemektir. Her aday gözenek bir ikili karar değişkenine dönüştürülür. Böylece fiziksel tasarım problemi, hangi gözeneklerin aktif edileceği sorusuna indirgenir.",
      },
      {
        title: "QUBO Hamiltonian Formülasyonu",
        body: ["H(x) minimize: akış ödülü, kısıt cezaları"],
        note: "Hamiltonian fonksiyonu bu çalışmanın matematiksel merkezidir. Düşük Hamiltonian değeri, daha uygun bir oksijen taşıma mimarisine işaret eder. Yüksek akış verimliliği ödüllendirilirken fiziksel kısıt ihlalleri cezalandırılır. QUBO bir modelleme dilidir; kuantum üstünlüğü iddiası yoktur.",
      },
      {
        title: "QUBO'dan Ising Uyumlu Optimizasyona",
        body: ["x = (1 + s) / 2  ·  s ∈ {−1, +1}"],
        note: "Klasik yöntemler küçük problemlerde çok değerlidir. Ancak değişken sayısı arttıkça tüm kombinasyonları denemek zorlaşır. QUBO yaklaşımı kuantum üstünlüğü iddiası için değil, problemi ikili değişkenlerle açık ve sistematik bir optimizasyon diline dönüştürdüğü için seçilmiştir.",
      },
      {
        title: "Doğrulama: Altı Gözenekli Benchmark",
        body: [
          "6 gözenek · Pmax=0,80 · K=3",
          "Tümüyle arama: 2⁶ = 64 durum",
        ],
        note: "Altı gözenekli benchmark küçük ama öğretici bir örnektir. Tüm kombinasyonlar klasik exhaustive search ile denenebilir. Bu da modelin küçük ölçekte doğrulanmasına imkân verir.",
      },
      {
        title: "Optimal Uygulanabilir Konfigürasyon",
        body: [
          "Seçilen: {1, 2, 6}",
          "η = 2,35 · P = 0,80 · Uygulanabilir ✓",
        ],
        note: "Bulguların en önemli mesajı şudur: En yüksek bireysel verimliliğe sahip gözenekler her zaman en iyi sistem çözümünü oluşturmaz. Model gözenekleri tek tek değil, birlikte oluşturdukları akış ağı üzerinden değerlendirir.",
      },
      {
        title: "Ağ Etkileri Önemlidir",
        body: ["Yüksek fᵢ tek başına yetmez — basınç & süreklilik"],
        note: "Yüksek verimli bir gözenek; fazla basınç, olumsuz hidrolik etkileşim veya kopuk yol nedeniyle elenebilir. Sistem davranışı tekil performansların toplamı değildir.",
      },
      {
        title: "Dinamik Çok Kanallı Nanoporlu Ağlara Ölçekleme",
        body: [
          "6 × 8 = 48 ikili değişken",
          "Arama uzayı: 2⁴⁸",
        ],
        note: "Problem büyüdükçe arama uzayı üstel olarak artar. Bu nedenle büyük ağlarda exhaustive search pratik değildir. QUBO/Ising uyumlu yapı, daha büyük tasarım problemlerinde sezgisel ve enerji minimizasyon temelli çözümlere uygun bir zemin sağlar.",
      },
      {
        title: "Optimizasyon ve Doğrulama Stratejisi",
        body: ["Tümüyle arama · Simüle tavlama · Ising esinli"],
        note: "Küçük ağlar: kesin doğrulama için exhaustive search. Büyük ağlar: simulated annealing ve Ising esinli arama. Bu kavram kanıtında kuantum üstünlüğü iddiası yoktur.",
      },
      {
        title: "Bu Çerçeve Ne Katkı Sağlar?",
        body: ["Nanokabarcık + QUBO/Ising optimizasyon katmanı"],
        note: "Çalışmanın amacı deneysel bir cihaz üretmek değil, nanoporlu oksijen taşıma mimarisi için hesaplamalı bir optimizasyon çerçevesi geliştirmektir. Bu çerçeve daha sonra CFD, deneysel ölçüm ve gerçek membran geometrileriyle genişletilebilir.",
      },
      {
        title: "Sonuç ve Gelecek Çalışmalar",
        body: [
          "QUBO uygulanabilir O₂ yollarını seçer",
          "Sırada: CFD · deney · gerçek geometri",
        ],
        note: "Bu çalışma deneysel olarak doğrulanmış bir cihaz tasarımı değildir; bir kavram kanıtıdır. Ana katkısı, oksijen taşıma mimarisini basınç, verimlilik ve süreklilik kısıtlarıyla birlikte ikili optimizasyon problemi olarak modellemesidir. Gelecekte CFD ve deneysel verilerle desteklendiğinde pratik bir karar destek aracına dönüşebilir.",
      },
      {
        title: "Temel Bulgular",
        body: [
          "Klasik naive {1,2,4} → uygulanamaz (P=0,90)",
          "QUBO optimum {1, 2, 6} · η=2,35 · P=0,80",
          "Exhaustive · SA · Ising → aynı sonuç",
          "Karşılaştırma tablosu →",
        ],
        note: "Altı gözenekli benchmark: klasik açgözlü seçim (en yüksek 3 fᵢ) {1,2,4} verir ve P=0.90 ile Pmax aşılır. QUBO tabanlı H(x) minimizasyonu uygulanabilir optimum {1,2,6} seçer. Exhaustive search, simulated annealing ve Ising uyumlu arama aynı çözüme ulaşır. Kuantum donanım üstünlüğü iddia edilmez.",
      },
      {
        title: "Sonuçların Yorumu",
        body: [
          "Optimum ≠ yalnızca en yüksek fᵢ",
          "Bağlantı ve hidrolik etkileşim önemli",
          "Yüksek verimli gözenek elenebilir",
          "QUBO kombinasyonları değerlendirir",
        ],
        note: "Sonuçların bilimsel anlamı oldukça önemlidir. En yüksek verimli gözenekler her zaman en iyi sistem çözümünü oluşturmaz. Çünkü ağ bağlantısı, basınç dağılımı ve hidrolik etkileşimler de sonucu belirler. QUBO yaklaşımı bu nedenle tekil gözenekleri değil, gözenek kombinasyonlarını değerlendirir.",
      },
      {
        title: "Tartışma",
        body: [
          "Kavram kanıtı — kuantum üstünlüğü iddiası yok",
          "QUBO yapılandırılmış ikili dil",
          "CFD veya deneyin yerini almaz",
          "Gelecek: CFD · laboratuvar · geometri",
        ],
        note: "Tartışmada özellikle dikkatli olmamız gereken nokta şudur: Bu çalışma kuantum üstünlüğü iddia etmez. QUBO modeli burada bir kuantum iddiası için değil, aktif-pasif gözenek seçimini ikili ve kısıtlı bir optimizasyon problemi olarak düzenli şekilde ifade etmek için kullanılmıştır. Gelecekte modelin CFD ve deneysel verilerle desteklenmesi gerekir.",
      },
      {
        title: "Sonuç",
        body: [
          "Kısıtlı ikili optimizasyon formülasyonu",
          "QUBO/Ising uygulanabilir O₂ yolları seçer",
          "Altı gözenek benchmark mantığı doğrular",
          "Ölçeklenebilir çok kanallı potansiyel",
        ],
        note: "Sonuç olarak bu çalışma, nanoporlu oksijen taşıma mimarisini fiziksel kısıtları olan bir ikili optimizasyon problemi olarak yeniden formüle eder. Altı gözenekli örnek modelin mantığını doğrular. Çok kanallı ağlara genişletme ise yaklaşımın daha büyük sistemlere uygulanabileceğini gösterir. Ana katkı, kuantum üstünlüğü iddiası değil; çevresel restorasyon için kullanılabilecek güçlü bir optimizasyon dili önermektir.",
      },
    ],
  },
  ro: {
    ui: {
      exit: "Ieșire",
      prev: "← Anterior",
      next: "Următor →",
      speakerNotes: "Note prezentator",
      notesHide: "Ascunde note",
      slideCounter: "Slide",
      notesLangHint: "Notele urmează limba prezentării (EN / TR / RO)",
      authorsTop: "Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Dezvoltare software)",
      authorsSlide: "Prof. Dr. Eden Mamut<br>Dr. Cumali Yaşar — Dezvoltare software",
      authorsFooter: "Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Dezvoltare software)",
      langLabel: "Limbă",
      liveSimulation: "Simulare live",
      backToSlides: "← Înapoi la slide-uri",
      runOptimization: "Rulează optimizarea",
      simHint: "Apăsați Run Optimization sau tasta S",
      active: "Activ",
      feasible: "Fezabil",
    },
    slides: [
      {
        title: "Optimizarea fluxului de oxigen în rețele nanoporoase folosind o mașină Ising cuantică",
        subtitle: "O abordare QUBO pentru de-eutrofizarea durabilă a apelor",
        body: [],
        note: "Întrebarea centrală: este suficient să adăugăm oxigen în apă, sau trebuie să optimizăm și prin ce pori, sub ce presiune și cu ce continuitate de flux este livrat oxigenul? Abordăm a doua variantă — livrare controlată la zona țintă. Nu se revendică avantaj cuantic; QUBO este un cadru de optimizare binară structurată.",
      },
      {
        title: "Enunțul problemei",
        body: [
          "Sisteme eutrofe → straturi deficitare în O₂",
          "O₂ la interfața apă-sediment — critic",
          "Livrarea nanoporoasă depășește aerarea simplă",
          "Eficiență, presiune, interacțiune, continuitate",
        ],
        note: "Enunțul problemei: este suficient să adăugăm oxigen în apă, sau trebuie optimizate porii, presiunea și continuitatea fluxului? Adoptăm a doua abordare — livrare eficientă și echilibrată la zona țintă sub constrângeri fizice.",
      },
      {
        title: "Ipoteza de cercetare",
        body: [
          "Fiecare por → variabilă binară",
          "Căi fezabile prin minimizarea Hamiltonianului",
          "Combinații de pori, nu performanță izolată",
          "Rută inspirată Ising pentru spații mari",
        ],
        note: "Ipoteza: dacă fiecare por candidat este modelat ca variabilă binară activ/inactiv, un Hamiltonian QUBO/Ising poate selecta căi de transport fezabile, respectând limitele de presiune și continuitatea fluxului. Scopul nu este superioritatea cuantică, ci un limbaj de optimizare binară puternic.",
      },
      {
        title: "Scopul studiului",
        body: [
          "Modelare pori ca variabile binare",
          "Recompensă căi O₂ eficiente",
          "Penalizare presiune & căi deconectate",
          "Validare benchmark șase pori",
          "Extindere la rețele multi-canal",
        ],
        note: "Scopul nu este construirea unui dispozitiv experimental, ci transformarea livrării nanoporoase într-o problemă de optimizare calculabilă: variabile binare, căi recompensate, încălcări penalizate.",
      },
      {
        title: "Metodă",
        body: [
          "1. Model rețea discretă de flux",
          "2. Codare binară a porilor",
          "3. Construcție Hamiltonian QUBO",
          "4. Validare exhaustivă șase pori",
          "5. Annealing & căutare Ising multi-canal",
        ],
        note: "Cinci pași: modelare rețea discretă; codare binară; Hamiltonian cu eficiență, presiune, număr de pori activi și continuitate; validare exhaustivă pe sisteme mici; metode euristice pe rețele mari.",
      },
      {
        title: "Model QUBO",
        body: [
          "H(x): recompensă eficiență + interacțiune",
          "Penalizări presiune & pori activi",
          "Penalizare continuitate C(x)",
          "H(x) mai mic → arhitectură mai bună",
        ],
        note: "Hamiltonianul este nucleul modelului QUBO. Energie mai mică indică o arhitectură mai bună. Căile eficiente sunt recompensate; depășirea presiunii, activarea excesivă și căile deconectate sunt penalizate.",
      },
      {
        title: "Apa de fund cu deficit de oxigen și eutrofizarea",
        body: [
          "Bloom alge → straturi hipoxice",
          "Țintă: O₂ la interfața apă-sediment",
        ],
        note: "În sistemele eutrofe, straturile de fund pot deveni deficitare în oxigen. Sedimentele hipoxice pot menține încărcarea internă cu nutrienți. Livrarea oxigenului la interfața apă-sediment este esențială pentru restaurare.",
      },
      {
        title: "Micro/nanobule de oxigen ca strategie de restaurare",
        body: [
          "~100 nm · transfer ridicat · urcare lentă",
          "Reședință lungă · oxigenare țintită",
        ],
        note: "Am ales acest subiect deoarece nanobulele de oxigen au potențial puternic pentru restaurarea apelor. Dar acest potențial devine avantaj real doar cu arhitectura corectă de canale și pori.",
      },
      {
        title: "Provocarea de proiectare: care pori trebuie activați?",
        body: [
          "Echilibru eficiență · presiune · continuitate",
          "Care submulțime e optimă?",
        ],
        note: "Întrebarea cheie: aerarea simplă este suficientă, sau trebuie optimizate selecția porilor, limitele de presiune și continuitatea fluxului? Livrarea nanoporoasă transformă aceasta într-o problemă de rețea constrânsă.",
      },
      {
        title: "Arhitectura de livrare a oxigenului nanoporous",
        body: [
          "O₂ → microcanale → membrană",
          "Eliberare la interfața apă-sediment",
        ],
        note: "Oxigenul curge de la intrare prin microcanale și membrana nanoporoasă până la interfața apă-sediment. Stratul fizic definește unde contează deciziile binare ale porilor.",
      },
      {
        title: "De la pori fizici la variabile binare",
        body: ["xᵢ = 1 activ · xᵢ = 0 inactiv"],
        note: "Primul pas metodologic: modelarea sistemului fizic ca rețea discretă. Fiecare por candidat devine o variabilă de decizie binară. Problema de proiectare se reduce la: ce pori trebuie activați?",
      },
      {
        title: "Formularea Hamiltonian QUBO",
        body: ["Minimizează H(x): recompensă flux, penalizări"],
        note: "Hamiltonianul este nucleul matematic. H(x) mai mic indică o arhitectură mai bună de transport al oxigenului. Eficiența fluxului este recompensată; încălcările constrângerilor sunt penalizate. QUBO este limbaj de modelare — nu se revendică superioritate cuantică.",
      },
      {
        title: "De la QUBO la optimizare compatibilă Ising",
        body: ["x = (1 + s) / 2  ·  s ∈ {−1, +1}"],
        note: "Metodele clasice sunt excelente pentru probleme mici, dar spațiul de căutare crește ca 2ⁿ. QUBO reformulează problema în formă binară pentru solvere clasice, euristice, inspirate Ising sau viitoare compatibile cu quantum — fără a revendica avantaj cuantic.",
      },
      {
        title: "Caz de validare: benchmark cu șase pori",
        body: [
          "6 pori · Pmax=0,80 · K=3",
          "Căutare exhaustivă: 2⁶ = 64",
        ],
        note: "Benchmark-ul cu șase pori este mic, dar instructiv. Toate cele 64 configurații pot fi verificate prin căutare exhaustivă clasică, permițând validarea transparentă a logicii QUBO.",
      },
      {
        title: "Configurație optimă fezabilă",
        body: [
          "Selectați: {1, 2, 6}",
          "η = 2,35 · P = 0,80 · Fezabil ✓",
        ],
        note: "Concluzia cheie: cea mai bună soluție nu este setul porilor cu cea mai mare eficiență individuală. Modelul evaluează porii împreună ca rețea de flux. Porul 4 poate fi exclus din cauza presiunii sau interacțiunilor.",
      },
      {
        title: "Efectele rețelei contează",
        body: ["fᵢ mare singur nu e suficient — presiune & continuitate"],
        note: "Un por cu eficiență ridicată poate fi exclus dacă provoacă depășirea presiunii, interacțiuni hidraulice nefavorabile sau căi deconectate. Comportamentul sistemului este emergent.",
      },
      {
        title: "Scalare la rețele nanoporoase multi-canal dinamice",
        body: [
          "6 × 8 = 48 variabile binare",
          "Spațiu: 2⁴⁸",
        ],
        note: "Pe măsură ce rețeaua crește, spațiul de căutare crește exponențial. Căutarea exhaustivă nu mai este practică. Structura QUBO/Ising suportă solvere euristice și de minimizare a energiei la scară mare.",
      },
      {
        title: "Strategie de optimizare și validare",
        body: ["Exhaustiv · Simulated annealing · Ising"],
        note: "Rețele mici: căutare exhaustivă pentru validare exactă. Rețele mari: simulated annealing și căutare inspirată Ising. Nu se revendică avantaj cuantic în această demonstrație computațională.",
      },
      {
        title: "Ce contribuie acest cadru?",
        body: ["Nanobule + strat optimizare QUBO/Ising"],
        note: "Scopul: dezvoltarea unui cadru computațional de optimizare pentru căi fezabile de oxigen în rețele nanoporoase — nu construirea unui dispozitiv validat experimental. Poate integra ulterior CFD, experimente și geometrii reale.",
      },
      {
        title: "Concluzii și direcții viitoare",
        body: [
          "QUBO selectează căi fezabile de O₂",
          "Viitor: CFD · experiment · geometrie reală",
        ],
        note: "Aceasta este o demonstrație de concept, nu un design de dispozitiv validat experimental. Contribuția principală: modelarea transportului de oxigen ca problemă de optimizare binară structurată sub constrângeri de presiune, eficiență și continuitate. Viitor: CFD, date experimentale, geometrii reale de membrană.",
      },
      {
        title: "Concluzii cheie",
        body: [
          "Naiv clasic {1,2,4} → nefezabil (P=0,90)",
          "Optim QUBO {1, 2, 6} · η=2,35 · P=0,80",
          "Exhaustiv · SA · Ising → același rezultat",
          "Vezi tabel comparativ →",
        ],
        note: "Benchmark șase pori: selecția clasică greedy (top-3 fᵢ) dă {1,2,4} cu P=0,90 — depășește Pmax. Minimizarea QUBO H(x) selectează optimumul fezabil {1,2,6}. Căutare exhaustivă, simulated annealing și căutare Ising ajung la aceeași soluție. Nu se revendică avantaj cuantic hardware.",
      },
      {
        title: "Interpretarea rezultatelor",
        body: [
          "Optim ≠ doar fᵢ individual maxim",
          "Conectivitatea & cuplajul hidraulic contează",
          "Por eficient poate fi exclus",
          "QUBO evaluează combinații",
        ],
        note: "Semnificația științifică: porii cu eficiență maximă nu formează întotdeauna cea mai bună soluție. Conectivitatea, distribuția presiunii și interacțiunile hidraulice decid. QUBO evaluează combinații, nu pori izolați.",
      },
      {
        title: "Discuție",
        body: [
          "Cadru demonstrativ — fără avantaj cuantic",
          "QUBO ca limbaj binar structurat",
          "Nu înlocuiește CFD sau experimente",
          "Viitor: CFD · date de laborator · geometrie",
        ],
        note: "Studiul nu revendică superioritate cuantică. QUBO este folosit pentru că selecția activ/inactiv este natural binară și fizic constrânsă. Integrarea CFD și a datelor experimentale este necesară.",
      },
      {
        title: "Concluzie",
        body: [
          "Formulare optimizare binară constrânsă",
          "QUBO/Ising selectează căi O₂ fezabile",
          "Benchmark șase pori confirmă logica",
          "Potențial scalabil multi-canal",
        ],
        note: "Concluzie: livrarea nanoporoasă este reformulată ca problemă de optimizare binară constrânsă. Exemplul cu șase pori validează logica; extinderea multi-canal arată scalabilitatea. Contribuția principală este un limbaj de optimizare — nu o revendicare cuantică.",
      },
    ],
  },
};
