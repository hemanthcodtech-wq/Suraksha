// Helper to parse category from prefixed filenames
export const parseDocumentCategory = (filename = '') => {
  if (filename.startsWith('SALE_DEED_')) {
    return {
      category: 'Current Registered Sale Deed',
      telugu: 'ప్రస్తుత రిజిస్టర్డ్ సేల్ డీడ్',
      cleanName: filename.replace('SALE_DEED_', ''),
      badgeColor: '#3b82f6',
      badgeBg: 'rgba(59, 130, 246, 0.15)'
    };
  }
  if (filename.startsWith('LINK_DOCS_')) {
    return {
      category: 'Link Documents (30 Yrs)',
      telugu: 'గత 30 సంవత్సరాల లింక్ డాక్యుమెంట్లు',
      cleanName: filename.replace('LINK_DOCS_', ''),
      badgeColor: '#8b5cf6',
      badgeBg: 'rgba(139, 92, 246, 0.15)'
    };
  }
  if (filename.startsWith('ENCUMBRANCE_CERT_')) {
    return {
      category: '30 Years EC',
      telugu: '30 సంవత్సరాల ఈసీ సర్టిఫికేట్',
      cleanName: filename.replace('ENCUMBRANCE_CERT_', ''),
      badgeColor: '#10b981',
      badgeBg: 'rgba(16, 185, 129, 0.15)'
    };
  }
  if (filename.startsWith('SANCTION_PLAN_')) {
    return {
      category: 'Layout & Sanction Plan',
      telugu: 'అప్రూవ్డ్ లేఅవుట్ & సాంక్షన్ ప్లాన్',
      cleanName: filename.replace('SANCTION_PLAN_', ''),
      badgeColor: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.15)'
    };
  }
  if (filename.startsWith('RERA_CERT_')) {
    return {
      category: 'RERA Certificate',
      telugu: 'RERA రిజిస్ట్రేషన్ సర్టిఫికేట్',
      cleanName: filename.replace('RERA_CERT_', ''),
      badgeColor: '#ec4899',
      badgeBg: 'rgba(236, 72, 153, 0.15)'
    };
  }
  if (filename.startsWith('TAX_RECEIPTS_')) {
    return {
      category: 'Mutation Certificate / Khata / Patta Passbook',
      telugu: 'Mutation Certificate / Khata / Patta Passbook',
      cleanName: filename.replace('TAX_RECEIPTS_', ''),
      badgeColor: '#14b8a6',
      badgeBg: 'rgba(20, 184, 166, 0.15)'
    };
  }

  return {
    category: 'Property Document',
    telugu: '',
    cleanName: filename,
    badgeColor: '#94a3b8',
    badgeBg: 'rgba(148, 163, 184, 0.12)'
  };
};
