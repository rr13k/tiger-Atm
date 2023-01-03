
const base_path = import.meta.env.BASE_URL || ''
export const getAssertPath = (path:string)=>{return base_path + path}
