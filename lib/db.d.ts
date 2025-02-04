declare module 'lib/db' {
  const dbConnect: () => Promise<any>;
  export default dbConnect;
}
