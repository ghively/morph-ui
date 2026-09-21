const names = ["ChatUIMorph", "Matrix", "CPI"];
for (const name of names) {
  const [first, ...rest] = name.split(/(?=[A-Z][a-z])/);
  console.log(name, "->", first, rest);
}
