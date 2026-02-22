// i need a function that return the current time
//type returned will be number
//I need time in Year, Month, Day, Hour, Minute and Second Format (number)

export function getCurrentTime(): number {
    const time = new Date();
    const year = time.getFullYear() * 10000000000;
    const month = (time.getMonth() + 1) * 100000000;
    const day = time.getDate() * 1000000;
    const hour = time.getHours() * 10000;
    const minute = time.getMinutes() * 100;
    const second = time.getSeconds();

    return year + month + day + hour + minute + second;
}
//example output: 20260219235959
// i have two checks, one for the temp secret which is valid for 5 minutes
// and the other for the real secret which is valid for 5 days
// the function should be getCurrentTime + 500 for the temp secret = 5 minutes
// and getCurrentTime + 500000 for the real secret = 5 days

export function checkTimeDifference(currTime: number, TimeInDB: number, isTemp: boolean): boolean {
    const timeDifference = currTime - TimeInDB;
    if (isTemp) {
        if (timeDifference > 500) { return true; }
        return false;
    }
    // i did this to make a time check of 5 days 
    // for the real secret. so I can restart the whole 
    // process. but future imporvement
    if (timeDifference > 500000) { return true; }
    return false;
}