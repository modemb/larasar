export function dateDiffIndays(date1: string | number | Date, date2: string | number | Date) {
  const dt1 = new Date(date1); const dt2 = new Date(date2)
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
    Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24))
} // Date Diff In Days

// https://dev.to/soyleninjs/3-ways-to-remove-duplicates-in-an-array-in-javascript-259o
export const findDuplicates = (array: unknown[]) => array?.filter((item, index) => array?.indexOf(item) !== index)
// const duplicateElements = findDuplicates(test);//https://flexiple.com/javascript/find-duplicates-javascript-array/#section3

export function printEl(el: string) {

  const getEl: HTMLElement | null = document.getElementById(el)
  const w = window.open();
  // const w = window.open('', 'PRINT', 'height=800,width=1000');

  w?.document.write('<html><head><title>' + document.title  + '</title>')
  w?.document.write('</head><body>')
  w?.document.write('<h1>' + document.title  + '</h1>')
  w?.document.write(getEl?getEl.innerHTML:'')
  w?.document.write('</body></html>')

  w?.document.close(); // necessary for IE >= 10
  w?.focus(); // necessary for IE >= 10*/

  w?.print(); // w.close();

  return true;
}
