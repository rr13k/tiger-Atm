/**
 * 范围内随机
 * @param Min 最小值
 * @param Max 最大值
 * @returns 
 */
export function RandomNumBoth(Min: number, Max: number): number {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}

export const __sleep = (ms:number) => new Promise((res) => setTimeout(res, ms))
