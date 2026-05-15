// ─── useInventory.js ───────────────────────────────────────────────────────
// Central data composable for the Inventory module.

const DRUG_CATEGORIES = [
  'Analgesics & NSAIDs', 'Antibiotics', 'Antacids & GI', 'Antihistamines',
  'Cardiovascular', 'Antidiabetics', 'Vitamins & Supplements', 'Dermatologicals',
  'Respiratory', 'Neurological', 'Ophthalmologicals', 'Others',
]

const DOSAGE_FORMS = [
  'Tablet', 'Capsule', 'Syrup', 'Suspension', 'Injection',
  'Cream / Ointment', 'Drops', 'Patch', 'Suppository', 'Inhaler', 'Powder', 'Solution',
]

const MANUFACTURERS = [
  'Unilab', 'Pfizer', 'Novartis', 'Roche', 'GlaxoSmithKline', 'Abbott',
  'Sanofi', 'Johnson & Johnson', 'Generika', 'MedExpress', 'Pharex', 'Intermed',
]

const UNITS_OF_MEASURE = [
  'Piece', 'Tablet', 'Capsule', 'Bottle', 'Vial', 'Ampule',
  'Sachet', 'Tube', 'Box', 'Strip', 'Patch', 'ml',
]

const STORAGE_REQUIREMENTS = [
  'Room Temperature', 'Refrigerated', 'Controlled / Narcotic', 'Frozen', 'Protect from Light',
]

const ADJUSTMENT_REASONS = [
  'Damaged', 'Expired', 'Lost / Missing', 'Return to Supplier', 'Count Correction', 'Other',
]

// ─── Seed Data ─────────────────────────────────────────────────────────────
const today = () => new Date()
const daysFromNow = (n) => {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10)
}
const daysAgo = (n) => {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10)
}

const SEED_DRUGS = [
  {
    id: 1,
    genericName: 'Paracetamol', brandName: 'Biogesic',
    category: 'Analgesics & NSAIDs', dosageForm: 'Tablet', strength: '500 mg',
    manufacturer: 'Unilab',
    description: 'Used for the relief of mild to moderate pain and fever. Indications include headache, toothache, backache, muscle aches, the common cold, and flu.',
    piecesPerStrip: 10, stripsPerBox: 10, sellByUnit: true,
    unitOfMeasure: 'Tablet',
    stock: 240, reorderLevel: 50, maxStock: 1000,
    batchNumber: 'BG-2024-001', expiryDate: daysFromNow(180), dateReceived: daysAgo(30),
    storageLocation: 'Shelf A-1', storageRequirement: 'Room Temperature',
    genericSubstitutes: [
      { id: 2, brandName: 'Tempra', strength: '500 mg' },
      { id: 3, brandName: 'Panadol', strength: '500 mg' },
    ],
    price: 2.50,
    adjustmentLog: [],
  },
  {
    id: 2,
    genericName: 'Paracetamol', brandName: 'Tempra',
    category: 'Analgesics & NSAIDs', dosageForm: 'Tablet', strength: '500 mg',
    manufacturer: 'Johnson & Johnson',
    description: 'Analgesic and antipyretic. Effective for pain relief and fever reduction without the GI side effects of NSAIDs.',
    piecesPerStrip: 10, stripsPerBox: 10, sellByUnit: true,
    unitOfMeasure: 'Tablet',
    stock: 180, reorderLevel: 50, maxStock: 800,
    batchNumber: 'TM-2024-012', expiryDate: daysFromNow(365), dateReceived: daysAgo(15),
    storageLocation: 'Shelf A-2', storageRequirement: 'Room Temperature',
    genericSubstitutes: [
      { id: 1, brandName: 'Biogesic', strength: '500 mg' },
      { id: 3, brandName: 'Panadol', strength: '500 mg' },
    ],
    price: 2.75,
    adjustmentLog: [],
  },
  {
    id: 3,
    genericName: 'Paracetamol', brandName: 'Panadol',
    category: 'Analgesics & NSAIDs', dosageForm: 'Tablet', strength: '500 mg',
    manufacturer: 'GlaxoSmithKline',
    description: 'Fast-acting pain reliever and fever reducer. Contains paracetamol as the active ingredient.',
    piecesPerStrip: 12, stripsPerBox: 8, sellByUnit: true,
    unitOfMeasure: 'Tablet',
    stock: 96, reorderLevel: 40, maxStock: 600,
    batchNumber: 'PN-2024-007', expiryDate: daysFromNow(25), dateReceived: daysAgo(60),
    storageLocation: 'Shelf A-3', storageRequirement: 'Room Temperature',
    genericSubstitutes: [
      { id: 1, brandName: 'Biogesic', strength: '500 mg' },
      { id: 2, brandName: 'Tempra', strength: '500 mg' },
    ],
    price: 3.00,
    adjustmentLog: [],
  },
  {
    id: 4,
    genericName: 'Amoxicillin', brandName: 'Amoxil',
    category: 'Antibiotics', dosageForm: 'Capsule', strength: '500 mg',
    manufacturer: 'GlaxoSmithKline',
    description: 'Broad-spectrum penicillin-type antibiotic used to treat bacterial infections such as pneumonia, bronchitis, and infections of the ear, nose, throat, skin, or urinary tract.',
    piecesPerStrip: 10, stripsPerBox: 5, sellByUnit: false,
    unitOfMeasure: 'Capsule',
    stock: 50, reorderLevel: 20, maxStock: 300,
    batchNumber: 'AX-2024-033', expiryDate: daysFromNow(90), dateReceived: daysAgo(10),
    storageLocation: 'Shelf B-1', storageRequirement: 'Room Temperature',
    genericSubstitutes: [{ id: 5, brandName: 'Amoxicot', strength: '500 mg' }],
    price: 12.00,
    adjustmentLog: [],
  },
  {
    id: 5,
    genericName: 'Amoxicillin', brandName: 'Amoxicot',
    category: 'Antibiotics', dosageForm: 'Capsule', strength: '500 mg',
    manufacturer: 'Pharex',
    description: 'Generic amoxicillin capsule for treatment of susceptible bacterial infections. Cost-effective alternative.',
    piecesPerStrip: 10, stripsPerBox: 5, sellByUnit: false,
    unitOfMeasure: 'Capsule',
    stock: 30, reorderLevel: 15, maxStock: 200,
    batchNumber: 'AC-2024-011', expiryDate: daysFromNow(200), dateReceived: daysAgo(5),
    storageLocation: 'Shelf B-2', storageRequirement: 'Room Temperature',
    genericSubstitutes: [{ id: 4, brandName: 'Amoxil', strength: '500 mg' }],
    price: 8.50,
    adjustmentLog: [],
  },
  {
    id: 6,
    genericName: 'Omeprazole', brandName: 'Omez',
    category: 'Antacids & GI', dosageForm: 'Capsule', strength: '20 mg',
    manufacturer: 'Novartis',
    description: 'Proton pump inhibitor used to treat GERD, peptic ulcers, and Zollinger-Ellison syndrome.',
    piecesPerStrip: 14, stripsPerBox: 2, sellByUnit: true,
    unitOfMeasure: 'Capsule',
    stock: 28, reorderLevel: 10, maxStock: 150,
    batchNumber: 'OZ-2024-005', expiryDate: daysFromNow(-5), dateReceived: daysAgo(120),
    storageLocation: 'Shelf C-1', storageRequirement: 'Room Temperature',
    genericSubstitutes: [{ id: 7, brandName: 'Prilosec', strength: '20 mg' }],
    price: 18.00,
    adjustmentLog: [],
  },
  {
    id: 7,
    genericName: 'Omeprazole', brandName: 'Prilosec',
    category: 'Antacids & GI', dosageForm: 'Capsule', strength: '20 mg',
    manufacturer: 'Abbott',
    description: 'Delayed-release omeprazole for acid-related disorders. Reduces gastric acid secretion for up to 24 hours.',
    piecesPerStrip: 14, stripsPerBox: 2, sellByUnit: true,
    unitOfMeasure: 'Capsule',
    stock: 14, reorderLevel: 10, maxStock: 100,
    batchNumber: 'PL-2024-009', expiryDate: daysFromNow(60), dateReceived: daysAgo(20),
    storageLocation: 'Shelf C-2', storageRequirement: 'Room Temperature',
    genericSubstitutes: [{ id: 6, brandName: 'Omez', strength: '20 mg' }],
    price: 22.00,
    adjustmentLog: [],
  },
  {
    id: 8,
    genericName: 'Cetirizine', brandName: 'Zyrtec',
    category: 'Antihistamines', dosageForm: 'Tablet', strength: '10 mg',
    manufacturer: 'Pfizer',
    description: 'Second-generation antihistamine used for allergic rhinitis, hay fever, urticaria and other allergy symptoms with minimal sedation.',
    piecesPerStrip: 7, stripsPerBox: 4, sellByUnit: true,
    unitOfMeasure: 'Tablet',
    stock: 56, reorderLevel: 20, maxStock: 400,
    batchNumber: 'ZT-2024-021', expiryDate: daysFromNow(300), dateReceived: daysAgo(8),
    storageLocation: 'Shelf D-1', storageRequirement: 'Room Temperature',
    genericSubstitutes: [{ id: 9, brandName: 'Allerta', strength: '10 mg' }],
    price: 28.00,
    adjustmentLog: [],
  },
  {
    id: 9,
    genericName: 'Cetirizine', brandName: 'Allerta',
    category: 'Antihistamines', dosageForm: 'Tablet', strength: '10 mg',
    manufacturer: 'Unilab',
    description: 'Non-drowsy antihistamine for 24-hour relief from allergy symptoms including sneezing, runny nose, and itchy eyes.',
    piecesPerStrip: 10, stripsPerBox: 3, sellByUnit: true,
    unitOfMeasure: 'Tablet',
    stock: 90, reorderLevel: 25, maxStock: 500,
    batchNumber: 'AL-2024-018', expiryDate: daysFromNow(400), dateReceived: daysAgo(3),
    storageLocation: 'Shelf D-2', storageRequirement: 'Room Temperature',
    genericSubstitutes: [{ id: 8, brandName: 'Zyrtec', strength: '10 mg' }],
    price: 15.00,
    adjustmentLog: [],
  },
  {
    id: 10,
    genericName: 'Amlodipine', brandName: 'Norvasc',
    category: 'Cardiovascular', dosageForm: 'Tablet', strength: '5 mg',
    manufacturer: 'Pfizer',
    description: 'Calcium channel blocker used to treat hypertension and coronary artery disease.',
    piecesPerStrip: 10, stripsPerBox: 3, sellByUnit: false,
    unitOfMeasure: 'Tablet',
    stock: 6, reorderLevel: 10, maxStock: 200,
    batchNumber: 'NV-2024-044', expiryDate: daysFromNow(150), dateReceived: daysAgo(45),
    storageLocation: 'Shelf E-1', storageRequirement: 'Room Temperature',
    genericSubstitutes: [{ id: 11, brandName: 'Ambesyl', strength: '5 mg' }],
    price: 35.00,
    adjustmentLog: [],
  },
  {
    id: 11,
    genericName: 'Amlodipine', brandName: 'Ambesyl',
    category: 'Cardiovascular', dosageForm: 'Tablet', strength: '5 mg',
    manufacturer: 'Generika',
    description: 'Generic amlodipine for the management of hypertension and angina pectoris. Once-daily dosing for blood pressure control.',
    piecesPerStrip: 10, stripsPerBox: 3, sellByUnit: false,
    unitOfMeasure: 'Tablet',
    stock: 0, reorderLevel: 10, maxStock: 200,
    batchNumber: 'AB-2024-003', expiryDate: daysFromNow(500), dateReceived: daysAgo(90),
    storageLocation: 'Shelf E-2', storageRequirement: 'Room Temperature',
    genericSubstitutes: [{ id: 10, brandName: 'Norvasc', strength: '5 mg' }],
    price: 22.00,
    adjustmentLog: [],
  },
  {
    id: 12,
    genericName: 'Insulin Glargine', brandName: 'Lantus',
    category: 'Antidiabetics', dosageForm: 'Injection', strength: '100 units/ml',
    manufacturer: 'Sanofi',
    description: 'Long-acting insulin analog used to control blood sugar in adults and children with type 1 or type 2 diabetes mellitus.',
    piecesPerStrip: 1, stripsPerBox: 5, sellByUnit: true,
    unitOfMeasure: 'Vial',
    stock: 15, reorderLevel: 5, maxStock: 50,
    batchNumber: 'LT-2024-088', expiryDate: daysFromNow(45), dateReceived: daysAgo(7),
    storageLocation: 'Refrigerator R-1', storageRequirement: 'Refrigerated',
    genericSubstitutes: [],
    price: 850.00,
    adjustmentLog: [],
  },
  {
    id: 13,
    genericName: 'Vitamin C', brandName: 'Cecon',
    category: 'Vitamins & Supplements', dosageForm: 'Tablet', strength: '500 mg',
    manufacturer: 'Intermed',
    description: 'Ascorbic acid supplement for prevention and treatment of Vitamin C deficiency. Supports immune function, collagen synthesis, and antioxidant protection.',
    piecesPerStrip: 10, stripsPerBox: 10, sellByUnit: true,
    unitOfMeasure: 'Tablet',
    stock: 500, reorderLevel: 100, maxStock: 2000,
    batchNumber: 'CC-2024-056', expiryDate: daysFromNow(730), dateReceived: daysAgo(1),
    storageLocation: 'Shelf F-1', storageRequirement: 'Room Temperature',
    genericSubstitutes: [],
    price: 3.50,
    adjustmentLog: [],
  },
]

// ─── Composable ────────────────────────────────────────────────────────────
export function useInventory() {
  const drugs = useState('drugs', () => SEED_DRUGS.map(d => ({ ...d, adjustmentLog: [...(d.adjustmentLog || [])] })))
  const nextId = useState('drugNextId', () => SEED_DRUGS.length + 1)

  // ── Filters / search ──────────────────────────────────────────────────
  const searchQuery = ref('')
  const filterCategory = ref('')
  const filterForm = ref('')
  const filterStorage = ref('')

  const filteredDrugs = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    return drugs.value.filter(drug => {
      const matchesQuery =
        !q ||
        drug.genericName.toLowerCase().includes(q) ||
        drug.brandName.toLowerCase().includes(q) ||
        drug.strength.toLowerCase().includes(q) ||
        drug.manufacturer.toLowerCase().includes(q) ||
        (drug.batchNumber || '').toLowerCase().includes(q) ||
        (drug.storageLocation || '').toLowerCase().includes(q)

      const matchesCategory = !filterCategory.value || drug.category === filterCategory.value
      const matchesForm = !filterForm.value || drug.dosageForm === filterForm.value
      const matchesStorage = !filterStorage.value || drug.storageRequirement === filterStorage.value

      return matchesQuery && matchesCategory && matchesForm && matchesStorage
    })
  })

  // ── Derived helpers ───────────────────────────────────────────────────
  const piecesPerBox = (drug) => drug.piecesPerStrip * drug.stripsPerBox

  const stockStatus = (drug) => {
    if (drug.stock === 0) return 'out'
    if (drug.stock <= drug.reorderLevel) return 'low'
    return 'ok'
  }

  /**
   * Expiry alert:
   *  'expired'  = past expiry date              → red
   *  'critical' = expires within 30 days        → red
   *  'warning'  = expires within 90 days        → yellow
   *  'ok'       = more than 90 days remaining
   */
  const expiryStatus = (drug) => {
    if (!drug.expiryDate) return 'ok'
    const diff = Math.ceil((new Date(drug.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
    if (diff <= 0) return 'expired'
    if (diff <= 30) return 'critical'
    if (diff <= 90) return 'warning'
    return 'ok'
  }

  const expiryDaysLeft = (drug) => {
    if (!drug.expiryDate) return null
    return Math.ceil((new Date(drug.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
  }

  const hasSubstitute = (drug) => drug.genericSubstitutes && drug.genericSubstitutes.length > 0

  const getSubstituteDetails = (drug) =>
    (drug.genericSubstitutes || [])
      .map(sub => drugs.value.find(d => d.id === sub.id))
      .filter(Boolean)

  // ── Stock adjustment ───────────────────────────────────────────────────
  const adjustStock = (id, { reason, quantity, notes }) => {
    const idx = drugs.value.findIndex(d => d.id === id)
    if (idx === -1) return
    const drug = drugs.value[idx]
    const newStock = Math.max(0, drug.stock - quantity)
    drugs.value[idx] = {
      ...drug,
      stock: newStock,
      adjustmentLog: [
        ...(drug.adjustmentLog || []),
        {
          date: new Date().toISOString(),
          reason,
          quantity,
          notes,
          stockBefore: drug.stock,
          stockAfter: newStock,
        },
      ],
    }
  }

  // ── CRUD ──────────────────────────────────────────────────────────────
  const addDrug = (data) => {
    drugs.value.push({ ...data, id: nextId.value++, genericSubstitutes: data.genericSubstitutes || [], adjustmentLog: [] })
  }

  const updateDrug = (id, data) => {
    const idx = drugs.value.findIndex(d => d.id === id)
    if (idx !== -1) drugs.value[idx] = { ...drugs.value[idx], ...data }
  }

  const deleteDrug = (id) => {
    drugs.value = drugs.value.filter(d => d.id !== id)
  }

  return {
    drugs, filteredDrugs,
    searchQuery, filterCategory, filterForm, filterStorage,
    DRUG_CATEGORIES, DOSAGE_FORMS, MANUFACTURERS, UNITS_OF_MEASURE, STORAGE_REQUIREMENTS, ADJUSTMENT_REASONS,
    piecesPerBox, stockStatus, expiryStatus, expiryDaysLeft, hasSubstitute, getSubstituteDetails,
    adjustStock, addDrug, updateDrug, deleteDrug,
  }
}
