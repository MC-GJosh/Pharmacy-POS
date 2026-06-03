// ─── useInventory.js ───────────────────────────────────────────────────────
import * as XLSX from 'xlsx'
import { useAuditTrail, AUDIT_ACTIONS } from '~/composables/useAuditTrail'
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
    costPrice: 1.50, wholesalePrice: 2.00, sellingPrice: 2.50,
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
    costPrice: 1.75, wholesalePrice: 2.25, sellingPrice: 2.75,
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
    costPrice: 2.00, wholesalePrice: 2.50, sellingPrice: 3.00,
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
    costPrice: 8.00, wholesalePrice: 10.00, sellingPrice: 12.00,
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
    costPrice: 5.00, wholesalePrice: 6.50, sellingPrice: 8.50,
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
    costPrice: 12.00, wholesalePrice: 15.00, sellingPrice: 18.00,
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
    costPrice: 15.00, wholesalePrice: 18.00, sellingPrice: 22.00,
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
    costPrice: 18.00, wholesalePrice: 22.00, sellingPrice: 28.00,
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
    costPrice: 10.00, wholesalePrice: 12.00, sellingPrice: 15.00,
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
    costPrice: 25.00, wholesalePrice: 30.00, sellingPrice: 35.00,
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
    costPrice: 15.00, wholesalePrice: 18.00, sellingPrice: 22.00,
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
    costPrice: 650.00, wholesalePrice: 750.00, sellingPrice: 850.00,
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
    costPrice: 2.00, wholesalePrice: 2.75, sellingPrice: 3.50,
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
    const { addLog } = useAuditTrail()
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
    addLog(AUDIT_ACTIONS.STOCK_ADJUSTED, `${drug.brandName} (${drug.genericName})`, {
      reason,
      quantity,
      notes,
      stockBefore: drug.stock,
      stockAfter: newStock,
    })
  }

  // ── CRUD ──────────────────────────────────────────────────────────────
  const addDrug = (data) => {
    const { addLog } = useAuditTrail()
    const newDrug = { ...data, id: nextId.value++, genericSubstitutes: data.genericSubstitutes || [], adjustmentLog: [] }
    drugs.value.push(newDrug)
    addLog(AUDIT_ACTIONS.PRODUCT_ADDED, `${data.brandName} (${data.genericName})`, {
      category: data.category,
      dosageForm: data.dosageForm,
      strength: data.strength,
      initialStock: data.stock,
    })
  }

  const updateDrug = (id, data) => {
    const { addLog } = useAuditTrail()
    const idx = drugs.value.findIndex(d => d.id === id)
    if (idx === -1) return
    const before = drugs.value[idx]
    drugs.value[idx] = { ...before, ...data }
    // Build a diff of changed fields for the audit details
    const changed = {}
    const watchFields = ['genericName', 'brandName', 'category', 'dosageForm', 'strength',
      'manufacturer', 'stock', 'reorderLevel', 'maxStock', 'costPrice', 'wholesalePrice',
      'sellingPrice', 'batchNumber', 'expiryDate', 'storageLocation', 'storageRequirement']
    watchFields.forEach(f => {
      if (data[f] !== undefined && data[f] !== before[f]) {
        changed[f] = { from: before[f], to: data[f] }
      }
    })
    addLog(AUDIT_ACTIONS.PRODUCT_EDITED, `${data.brandName || before.brandName} (${data.genericName || before.genericName})`, { changed })
  }

  const deleteDrug = (id) => {
    const { addLog } = useAuditTrail()
    const drug = drugs.value.find(d => d.id === id)
    drugs.value = drugs.value.filter(d => d.id !== id)
    if (drug) {
      addLog(AUDIT_ACTIONS.PRODUCT_DELETED, `${drug.brandName} (${drug.genericName})`, {
        category: drug.category,
        stockAtDeletion: drug.stock,
      })
    }
  }

  // ── Excel: Export inventory ────────────────────────────────────────────────
  const exportInventoryToExcel = () => {
    const rows = drugs.value.map(d => ({
      'Generic Name':        d.genericName,
      'Brand Name':          d.brandName,
      'Category':            d.category,
      'Dosage Form':         d.dosageForm,
      'Strength':            d.strength,
      'Manufacturer':        d.manufacturer,
      'Unit of Measure':     d.unitOfMeasure,
      'Pieces/Strip':        d.piecesPerStrip,
      'Strips/Box':          d.stripsPerBox,
      'Sell by Unit':        d.sellByUnit ? 'Yes' : 'No',
      'Stock':               d.stock,
      'Reorder Level':       d.reorderLevel,
      'Max Stock':           d.maxStock,
      'Batch Number':        d.batchNumber || '',
      'Expiry Date':         d.expiryDate || '',
      'Date Received':       d.dateReceived || '',
      'Storage Location':    d.storageLocation || '',
      'Storage Requirement': d.storageRequirement || '',
      'Cost Price':          d.costPrice,
      'Wholesale Price':     d.wholesalePrice,
      'Selling Price':       d.sellingPrice,
      'Description':         d.description || '',
    }))

    const ws = XLSX.utils.json_to_sheet(rows)

    // Bold header row styling
    const range = XLSX.utils.decode_range(ws['!ref'])
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddr = XLSX.utils.encode_cell({ r: 0, c: C })
      if (!ws[cellAddr]) continue
      ws[cellAddr].s = { font: { bold: true }, fill: { fgColor: { rgb: '0E4F7A' } }, alignment: { horizontal: 'center' } }
    }

    // Column widths
    ws['!cols'] = [
      { wch: 20 }, { wch: 18 }, { wch: 22 }, { wch: 14 }, { wch: 12 },
      { wch: 18 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
      { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 16 }, { wch: 14 },
      { wch: 14 }, { wch: 20 }, { wch: 22 }, { wch: 12 }, { wch: 16 },
      { wch: 14 }, { wch: 36 },
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory')
    const now = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(wb, `pharmacy-inventory-${now}.xlsx`)
  }

  // ── Excel: Download import template ───────────────────────────────────────
  const downloadImportTemplate = () => {
    const headers = [
      'Generic Name', 'Brand Name', 'Category', 'Dosage Form', 'Strength',
      'Manufacturer', 'Unit of Measure', 'Pieces/Strip', 'Strips/Box', 'Sell by Unit',
      'Stock', 'Reorder Level', 'Max Stock', 'Batch Number', 'Expiry Date',
      'Date Received', 'Storage Location', 'Storage Requirement',
      'Cost Price', 'Wholesale Price', 'Selling Price', 'Description',
    ]

    const samples = [
      [
        'Paracetamol', 'Biogesic', 'Analgesics & NSAIDs', 'Tablet', '500 mg',
        'Unilab', 'Tablet', 10, 10, 'Yes',
        100, 20, 500, 'BG-2024-001', '2025-12-31',
        '2024-01-15', 'Shelf A-1', 'Room Temperature',
        1.50, 2.00, 2.50, 'Pain reliever and fever reducer',
      ],
      [
        'Amoxicillin', 'Amoxil', 'Antibiotics', 'Capsule', '500 mg',
        'GlaxoSmithKline', 'Capsule', 10, 5, 'No',
        50, 10, 200, 'AX-2024-010', '2025-06-30',
        '2024-02-01', 'Shelf B-1', 'Room Temperature',
        8.00, 10.00, 12.00, 'Broad-spectrum antibiotic',
      ],
    ]

    const ws = XLSX.utils.aoa_to_sheet([headers, ...samples])

    // Bold + styled header row
    for (let C = 0; C < headers.length; C++) {
      const addr = XLSX.utils.encode_cell({ r: 0, c: C })
      if (!ws[addr]) continue
      ws[addr].s = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '0369A1' } }, alignment: { horizontal: 'center', wrapText: true } }
    }

    // Column widths
    ws['!cols'] = headers.map(() => ({ wch: 20 }))

    // Notes on key columns
    const notesMap = {
      'Category':            'Allowed: ' + DRUG_CATEGORIES.join(', '),
      'Dosage Form':         'Allowed: ' + DOSAGE_FORMS.join(', '),
      'Unit of Measure':     'Allowed: ' + UNITS_OF_MEASURE.join(', '),
      'Storage Requirement': 'Allowed: ' + STORAGE_REQUIREMENTS.join(', '),
      'Sell by Unit':        'Use Yes or No',
      'Expiry Date':         'Format: YYYY-MM-DD',
      'Date Received':       'Format: YYYY-MM-DD',
      'Cost Price':          'Number (e.g. 8.50)',
      'Wholesale Price':     'Number, must be ≥ Cost Price',
      'Selling Price':       'Number, must be ≥ Cost Price',
    }
    headers.forEach((h, C) => {
      if (!notesMap[h]) return
      const addr = XLSX.utils.encode_cell({ r: 0, c: C })
      if (ws[addr]) ws[addr].c = [{ a: 'Template', t: notesMap[h] }]
    })

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Drug Import Template')
    XLSX.writeFile(wb, 'pharmacy-import-template.xlsx')
  }

  // ── Excel: Import from XLSX ────────────────────────────────────────────────
  const importFromExcel = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: 'binary', cellDates: true })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rawRows = XLSX.utils.sheet_to_json(ws, { defval: '' })

        const imported = []
        const errors   = []

        rawRows.forEach((row, i) => {
          const rowNum  = i + 2 // 1-indexed, +1 for header
          const rowErrors = []

          const get = (key) => (row[key] ?? '').toString().trim()
          const getNum = (key) => parseFloat(get(key))

          // Required text fields
          const textFields = ['Generic Name', 'Brand Name', 'Strength', 'Manufacturer']
          textFields.forEach(f => {
            if (!get(f)) rowErrors.push({ field: f, msg: `"${f}" is required` })
          })

          // Enum validations
          const cat = get('Category')
          if (!cat) {
            rowErrors.push({ field: 'Category', msg: '"Category" is required' })
          } else if (!DRUG_CATEGORIES.includes(cat)) {
            rowErrors.push({ field: 'Category', msg: `"${cat}" is not a valid category` })
          }

          const form = get('Dosage Form')
          if (!form) {
            rowErrors.push({ field: 'Dosage Form', msg: '"Dosage Form" is required' })
          } else if (!DOSAGE_FORMS.includes(form)) {
            rowErrors.push({ field: 'Dosage Form', msg: `"${form}" is not a valid dosage form` })
          }

          const uom = get('Unit of Measure')
          if (uom && !UNITS_OF_MEASURE.includes(uom)) {
            rowErrors.push({ field: 'Unit of Measure', msg: `"${uom}" is not a valid unit` })
          }

          const stor = get('Storage Requirement')
          if (stor && !STORAGE_REQUIREMENTS.includes(stor)) {
            rowErrors.push({ field: 'Storage Requirement', msg: `"${stor}" is not a valid storage requirement` })
          }

          // Numeric fields
          const cost  = getNum('Cost Price')
          const whole = getNum('Wholesale Price')
          const sell  = getNum('Selling Price')
          const stock = parseInt(get('Stock'), 10)
          const reorder = parseInt(get('Reorder Level'), 10)

          if (isNaN(cost) || cost < 0)   rowErrors.push({ field: 'Cost Price',     msg: 'Must be a positive number' })
          if (isNaN(sell) || sell < 0)   rowErrors.push({ field: 'Selling Price',  msg: 'Must be a positive number' })
          if (!isNaN(cost) && !isNaN(sell) && sell < cost)
            rowErrors.push({ field: 'Selling Price', msg: `Selling price (${sell}) must be ≥ cost price (${cost})` })
          if (isNaN(stock) || stock < 0)  rowErrors.push({ field: 'Stock',         msg: 'Must be an integer ≥ 0' })
          if (isNaN(reorder) || reorder < 0) rowErrors.push({ field: 'Reorder Level', msg: 'Must be an integer ≥ 0' })

          // Expiry date
          const expiryRaw = get('Expiry Date')
          let expiryDate = ''
          if (!expiryRaw) {
            rowErrors.push({ field: 'Expiry Date', msg: '"Expiry Date" is required' })
          } else {
            // Handle Excel date serial numbers
            if (typeof row['Expiry Date'] === 'number') {
              const d = XLSX.SSF.parse_date_code(row['Expiry Date'])
              expiryDate = `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`
            } else if (row['Expiry Date'] instanceof Date) {
              expiryDate = row['Expiry Date'].toISOString().slice(0,10)
            } else {
              expiryDate = expiryRaw
            }
            const parsedExpiry = new Date(expiryDate)
            if (isNaN(parsedExpiry.getTime())) {
              rowErrors.push({ field: 'Expiry Date', msg: `"${expiryRaw}" is not a valid date (use YYYY-MM-DD)` })
              expiryDate = ''
            }
          }

          // Date received
          let dateReceived = ''
          if (row['Date Received'] instanceof Date) {
            dateReceived = row['Date Received'].toISOString().slice(0,10)
          } else if (typeof row['Date Received'] === 'number') {
            const d = XLSX.SSF.parse_date_code(row['Date Received'])
            dateReceived = `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`
          } else {
            dateReceived = get('Date Received')
          }

          const parsed = {
            genericName:         get('Generic Name'),
            brandName:           get('Brand Name'),
            category:            cat,
            dosageForm:          form,
            strength:            get('Strength'),
            manufacturer:        get('Manufacturer'),
            unitOfMeasure:       uom || 'Piece',
            piecesPerStrip:      parseInt(get('Pieces/Strip'), 10) || 10,
            stripsPerBox:        parseInt(get('Strips/Box'), 10) || 1,
            sellByUnit:          get('Sell by Unit').toLowerCase() === 'yes',
            stock:               isNaN(stock) ? 0 : stock,
            reorderLevel:        isNaN(reorder) ? 0 : reorder,
            maxStock:            parseInt(get('Max Stock'), 10) || 1000,
            batchNumber:         get('Batch Number'),
            expiryDate,
            dateReceived,
            storageLocation:     get('Storage Location'),
            storageRequirement:  stor || 'Room Temperature',
            costPrice:           isNaN(cost) ? 0 : cost,
            wholesalePrice:      isNaN(whole) ? 0 : whole,
            sellingPrice:        isNaN(sell) ? 0 : sell,
            description:         get('Description'),
            genericSubstitutes:  [],
            adjustmentLog:       [],
          }

          if (rowErrors.length > 0) {
            errors.push({ row: rowNum, data: parsed, rawRow: row, errors: rowErrors })
          } else {
            imported.push({ row: rowNum, data: parsed })
          }
        })

        resolve({ imported, errors })
      }
      reader.readAsBinaryString(file)
    })
  }

  return {
    drugs, filteredDrugs,
    searchQuery, filterCategory, filterForm, filterStorage,
    DRUG_CATEGORIES, DOSAGE_FORMS, MANUFACTURERS, UNITS_OF_MEASURE, STORAGE_REQUIREMENTS, ADJUSTMENT_REASONS,
    piecesPerBox, stockStatus, expiryStatus, expiryDaysLeft, hasSubstitute, getSubstituteDetails,
    adjustStock, addDrug, updateDrug, deleteDrug,
    exportInventoryToExcel, downloadImportTemplate, importFromExcel,
  }
}
