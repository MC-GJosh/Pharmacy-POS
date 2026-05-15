// ─── useInventory.js ───────────────────────────────────────────────────────
// Central data composable for the Inventory module.
// Manages the full drug/product schema with all required fields.

const DRUG_CATEGORIES = [
  'Analgesics & NSAIDs',
  'Antibiotics',
  'Antacids & GI',
  'Antihistamines',
  'Cardiovascular',
  'Antidiabetics',
  'Vitamins & Supplements',
  'Dermatologicals',
  'Respiratory',
  'Neurological',
  'Ophthalmologicals',
  'Others',
]

const DOSAGE_FORMS = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Suspension',
  'Injection',
  'Cream / Ointment',
  'Drops',
  'Patch',
  'Suppository',
  'Inhaler',
  'Powder',
  'Solution',
]

const MANUFACTURERS = [
  'Unilab',
  'Pfizer',
  'Novartis',
  'Roche',
  'GlaxoSmithKline',
  'Abbott',
  'Sanofi',
  'Johnson & Johnson',
  'Generika',
  'MedExpress',
  'Pharex',
  'Intermed',
]

// ─── Seed Data ─────────────────────────────────────────────────────────────
const SEED_DRUGS = [
  {
    id: 1,
    genericName: 'Paracetamol',
    brandName: 'Biogesic',
    category: 'Analgesics & NSAIDs',
    dosageForm: 'Tablet',
    strength: '500 mg',
    manufacturer: 'Unilab',
    description: 'Used for the relief of mild to moderate pain and fever. Indications include headache, toothache, backache, muscle aches, the common cold, and flu.',
    piecesPerStrip: 10,
    stripsPerBox: 10,
    sellByUnit: true,
    stock: 240,
    genericSubstitutes: [
      { id: 2, brandName: 'Tempra', strength: '500 mg' },
      { id: 3, brandName: 'Panadol', strength: '500 mg' },
    ],
    price: 2.50,
    reorderLevel: 50,
  },
  {
    id: 2,
    genericName: 'Paracetamol',
    brandName: 'Tempra',
    category: 'Analgesics & NSAIDs',
    dosageForm: 'Tablet',
    strength: '500 mg',
    manufacturer: 'Johnson & Johnson',
    description: 'Analgesic and antipyretic. Effective for pain relief and fever reduction without the GI side effects of NSAIDs.',
    piecesPerStrip: 10,
    stripsPerBox: 10,
    sellByUnit: true,
    stock: 180,
    genericSubstitutes: [
      { id: 1, brandName: 'Biogesic', strength: '500 mg' },
      { id: 3, brandName: 'Panadol', strength: '500 mg' },
    ],
    price: 2.75,
    reorderLevel: 50,
  },
  {
    id: 3,
    genericName: 'Paracetamol',
    brandName: 'Panadol',
    category: 'Analgesics & NSAIDs',
    dosageForm: 'Tablet',
    strength: '500 mg',
    manufacturer: 'GlaxoSmithKline',
    description: 'Fast-acting pain reliever and fever reducer. Contains paracetamol as the active ingredient.',
    piecesPerStrip: 12,
    stripsPerBox: 8,
    sellByUnit: true,
    stock: 96,
    genericSubstitutes: [
      { id: 1, brandName: 'Biogesic', strength: '500 mg' },
      { id: 2, brandName: 'Tempra', strength: '500 mg' },
    ],
    price: 3.00,
    reorderLevel: 40,
  },
  {
    id: 4,
    genericName: 'Amoxicillin',
    brandName: 'Amoxil',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '500 mg',
    manufacturer: 'GlaxoSmithKline',
    description: 'Broad-spectrum penicillin-type antibiotic used to treat bacterial infections such as pneumonia, bronchitis, and infections of the ear, nose, throat, skin, or urinary tract.',
    piecesPerStrip: 10,
    stripsPerBox: 5,
    sellByUnit: false,
    stock: 50,
    genericSubstitutes: [
      { id: 5, brandName: 'Amoxicot', strength: '500 mg' },
    ],
    price: 12.00,
    reorderLevel: 20,
  },
  {
    id: 5,
    genericName: 'Amoxicillin',
    brandName: 'Amoxicot',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '500 mg',
    manufacturer: 'Pharex',
    description: 'Generic amoxicillin capsule for treatment of susceptible bacterial infections. Cost-effective alternative.',
    piecesPerStrip: 10,
    stripsPerBox: 5,
    sellByUnit: false,
    stock: 30,
    genericSubstitutes: [
      { id: 4, brandName: 'Amoxil', strength: '500 mg' },
    ],
    price: 8.50,
    reorderLevel: 15,
  },
  {
    id: 6,
    genericName: 'Omeprazole',
    brandName: 'Omez',
    category: 'Antacids & GI',
    dosageForm: 'Capsule',
    strength: '20 mg',
    manufacturer: 'Novartis',
    description: 'Proton pump inhibitor used to treat gastroesophageal reflux disease (GERD), peptic ulcers, and Zollinger-Ellison syndrome by reducing stomach acid production.',
    piecesPerStrip: 14,
    stripsPerBox: 2,
    sellByUnit: true,
    stock: 28,
    genericSubstitutes: [
      { id: 7, brandName: 'Prilosec', strength: '20 mg' },
    ],
    price: 18.00,
    reorderLevel: 10,
  },
  {
    id: 7,
    genericName: 'Omeprazole',
    brandName: 'Prilosec',
    category: 'Antacids & GI',
    dosageForm: 'Capsule',
    strength: '20 mg',
    manufacturer: 'Abbott',
    description: 'Delayed-release omeprazole for acid-related disorders. Reduces gastric acid secretion for up to 24 hours.',
    piecesPerStrip: 14,
    stripsPerBox: 2,
    sellByUnit: true,
    stock: 14,
    genericSubstitutes: [
      { id: 6, brandName: 'Omez', strength: '20 mg' },
    ],
    price: 22.00,
    reorderLevel: 10,
  },
  {
    id: 8,
    genericName: 'Cetirizine',
    brandName: 'Zyrtec',
    category: 'Antihistamines',
    dosageForm: 'Tablet',
    strength: '10 mg',
    manufacturer: 'Pfizer',
    description: 'Second-generation antihistamine used for allergic rhinitis, hay fever, urticaria (hives), and other allergy symptoms with minimal sedation.',
    piecesPerStrip: 7,
    stripsPerBox: 4,
    sellByUnit: true,
    stock: 56,
    genericSubstitutes: [
      { id: 9, brandName: 'Allerta', strength: '10 mg' },
    ],
    price: 28.00,
    reorderLevel: 20,
  },
  {
    id: 9,
    genericName: 'Cetirizine',
    brandName: 'Allerta',
    category: 'Antihistamines',
    dosageForm: 'Tablet',
    strength: '10 mg',
    manufacturer: 'Unilab',
    description: 'Non-drowsy antihistamine for 24-hour relief from allergy symptoms including sneezing, runny nose, and itchy eyes.',
    piecesPerStrip: 10,
    stripsPerBox: 3,
    sellByUnit: true,
    stock: 90,
    genericSubstitutes: [
      { id: 8, brandName: 'Zyrtec', strength: '10 mg' },
    ],
    price: 15.00,
    reorderLevel: 25,
  },
  {
    id: 10,
    genericName: 'Amlodipine',
    brandName: 'Norvasc',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '5 mg',
    manufacturer: 'Pfizer',
    description: 'Calcium channel blocker used to treat hypertension and coronary artery disease. Helps relax blood vessels to allow the heart to pump more easily.',
    piecesPerStrip: 10,
    stripsPerBox: 3,
    sellByUnit: false,
    stock: 6,
    genericSubstitutes: [
      { id: 11, brandName: 'Ambesyl', strength: '5 mg' },
    ],
    price: 35.00,
    reorderLevel: 10,
  },
  {
    id: 11,
    genericName: 'Amlodipine',
    brandName: 'Ambesyl',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '5 mg',
    manufacturer: 'Generika',
    description: 'Generic amlodipine for the management of hypertension and angina pectoris. Once-daily dosing for blood pressure control.',
    piecesPerStrip: 10,
    stripsPerBox: 3,
    sellByUnit: false,
    stock: 0,
    genericSubstitutes: [
      { id: 10, brandName: 'Norvasc', strength: '5 mg' },
    ],
    price: 22.00,
    reorderLevel: 10,
  },
  {
    id: 12,
    genericName: 'Vitamin C',
    brandName: 'Cecon',
    category: 'Vitamins & Supplements',
    dosageForm: 'Tablet',
    strength: '500 mg',
    manufacturer: 'Intermed',
    description: 'Ascorbic acid supplement for prevention and treatment of Vitamin C deficiency. Supports immune function, collagen synthesis, and antioxidant protection.',
    piecesPerStrip: 10,
    stripsPerBox: 10,
    sellByUnit: true,
    stock: 500,
    genericSubstitutes: [],
    price: 3.50,
    reorderLevel: 100,
  },
]

// ─── Composable ────────────────────────────────────────────────────────────
export function useInventory() {
  const drugs = useState('drugs', () => SEED_DRUGS.map(d => ({ ...d })))
  const nextId = useState('drugNextId', () => SEED_DRUGS.length + 1)

  // ── Filters / search ──────────────────────────────────────────────────
  const searchQuery = ref('')
  const filterCategory = ref('')
  const filterForm = ref('')

  const filteredDrugs = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    return drugs.value.filter(drug => {
      const matchesQuery =
        !q ||
        drug.genericName.toLowerCase().includes(q) ||
        drug.brandName.toLowerCase().includes(q) ||
        drug.strength.toLowerCase().includes(q) ||
        drug.manufacturer.toLowerCase().includes(q)

      const matchesCategory =
        !filterCategory.value || drug.category === filterCategory.value

      const matchesForm =
        !filterForm.value || drug.dosageForm === filterForm.value

      return matchesQuery && matchesCategory && matchesForm
    })
  })

  // ── Derived helpers ───────────────────────────────────────────────────
  /** Total pieces in a box */
  const piecesPerBox = (drug) => drug.piecesPerStrip * drug.stripsPerBox

  /** Stock status */
  const stockStatus = (drug) => {
    if (drug.stock === 0) return 'out'
    if (drug.stock <= drug.reorderLevel) return 'low'
    return 'ok'
  }

  /** Does this drug have a generic substitute? */
  const hasSubstitute = (drug) => drug.genericSubstitutes && drug.genericSubstitutes.length > 0

  /** Get full drug objects for substitutes */
  const getSubstituteDetails = (drug) =>
    (drug.genericSubstitutes || [])
      .map(sub => drugs.value.find(d => d.id === sub.id))
      .filter(Boolean)

  // ── CRUD ──────────────────────────────────────────────────────────────
  const addDrug = (data) => {
    drugs.value.push({ ...data, id: nextId.value++, genericSubstitutes: data.genericSubstitutes || [] })
  }

  const updateDrug = (id, data) => {
    const idx = drugs.value.findIndex(d => d.id === id)
    if (idx !== -1) drugs.value[idx] = { ...drugs.value[idx], ...data }
  }

  const deleteDrug = (id) => {
    drugs.value = drugs.value.filter(d => d.id !== id)
  }

  return {
    // state
    drugs,
    filteredDrugs,
    searchQuery,
    filterCategory,
    filterForm,
    // constants
    DRUG_CATEGORIES,
    DOSAGE_FORMS,
    MANUFACTURERS,
    // helpers
    piecesPerBox,
    stockStatus,
    hasSubstitute,
    getSubstituteDetails,
    // crud
    addDrug,
    updateDrug,
    deleteDrug,
  }
}
