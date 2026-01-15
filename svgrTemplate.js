module.exports = ({ componentName, jsx }, { tpl }) => {
  return tpl`
      const ${componentName} = (props) => ${jsx};
      export default ${componentName};
    `;
};
