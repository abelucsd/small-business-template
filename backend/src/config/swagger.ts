import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as jsyaml from 'js-yaml';


const yaml = jsyaml;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// swagger docs
export const swaggerDocument = loadYamlFile<Record<string, any>>('../../docs/index.yaml');
const userPaths = loadYamlFile<Record<string, any>>('../../docs/paths/user.yaml');
const customerPaths = loadYamlFile<Record<string, any>>('../../docs/paths/customer.yaml');
const productPaths = loadYamlFile<Record<string, any>>('../../docs/paths/product.yaml');
const categoryPaths = loadYamlFile<Record<string, any>>('../../docs/paths/category.yaml');

const userPathsComponents = loadYamlFile<Record<string, any>>('../../docs/components/schemas/user.yaml');
const customerPathsComponents = loadYamlFile<Record<string, any>>('../../docs/components/schemas/customer.yaml');
const productComponents = loadYamlFile<Record<string, any>>('../../docs/components/schemas/product.yaml');
const categoryComponents = loadYamlFile<Record<string, any>>('../../docs/components/schemas/category.yaml');

swaggerDocument.paths = {
  ...userPaths,
  ...customerPaths,
  ...productPaths,
  ...categoryPaths,    
};
swaggerDocument.components = {
  schemas:{
    ...userPathsComponents,
    ...customerPathsComponents,
    ...productComponents,
    ...categoryComponents,        
  }
};


function loadYamlFile<T>(filePath: string): T {
  const fullPath = path.join(__dirname, filePath);
  return yaml.load(fs.readFileSync(fullPath, 'utf8')) as T;
};