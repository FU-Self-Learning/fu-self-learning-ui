export function formatChatbotResponse(text: string): string {
  if (!text) return '';
  // Remove mảng số ở cuối response (\n[12, 14, 15] hoặc \n[44])
  let cleaned = text.replace(/\n?\[\d+(,\s*\d+)*\]\s*$/g, '');
  // Sau dấu hai chấm thì xuống dòng
  cleaned = cleaned.replace(/:\s*/g, ':\n');
  // Sau dấu chấm thì xuống dòng
  cleaned = cleaned.replace(/\.\s+/g, '.\n');
  // Đảm bảo chỉ có 1 dấu xuống dòng liên tiếp
  cleaned = cleaned.replace(/\n{2,}/g, '\n');
  // In hoa chữ cái đầu sau mỗi lần xuống dòng
  cleaned = cleaned.replace(/(^|\n)([a-zà-ỹ])/g, (m, p1, p2) => p1 + p2.toUpperCase());
  return cleaned.trim();
}
