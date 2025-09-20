// utils/aiIntegration.js
// Simulated AI integration for document safety check & draft generation

// Example rules-based safety check
export async function checkDocumentSafety(documentText) {
  // Simple rule checks for demonstration
  const details = [];
  if (!documentText.match(/\bdate\b/i)) details.push('Missing crucial date');
  if (!documentText.match(/\bparty\b/i)) details.push('Missing party names');
  if (!documentText.match(/\bsignature\b/i)) details.push('Missing signature');

  return {
    isSafe: details.length === 0,
    details,
  };
}

// Example draft generation function (simulate AI)
export async function generateDraftDocument(type, placeholders) {
  // Basic templates with placeholders
  const templates = {
    contract: `This Contract is made on {{date}} between {{partyA}} and {{partyB}}.
    
Terms and Conditions:
- The parties agree to the following terms...

Signature: ____________________`,
    agreement: `This Agreement is entered into on {{date}} by and between {{partyA}} and {{partyB}}.

Details of Agreement:
- ...

Signature: ____________________`,
  };

  let draft = templates[type] || 'No template available for this document type.';
  for (const key in placeholders) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    draft = draft.replace(regex, placeholders[key]);
  }

  // Fill placeholders with default if missing
  draft = draft.replace(/{{\w+}}/g, '________');

  return draft;
}