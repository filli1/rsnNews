/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
 var removeElement = function(nums, val) {
    let i = 0
    let j = 0

    if(!nums.lenght){
        return 0
    }

    while(j < nums.length){
        console.log(nums[j]+'!=='+val+' – '+nums[j]!==val)
        if(nums[j]!==val){
            nums[i] = nums[j]
            i += 1;
        }
        j += 1;
    }
    return i
};


removeElement([3,2,2,3],3)