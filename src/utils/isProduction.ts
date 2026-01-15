export default function isProduction(): boolean {
  return import.meta.env.MODE === 'production';
}
