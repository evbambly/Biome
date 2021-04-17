export type RandomConvergentFunction = {
    pastPoints: number[],
    target: number,
    finalLength: number,
    stepSize: number,
    maxDivergence?: number,
}

export const GetRandomConvergentFunction = 
(start: number, target: number, length: number, stepSize: number, maxDivergence?:number) : RandomConvergentFunction => {
    return {
        pastPoints: [start],
        target,
        finalLength: length,
        stepSize,
        maxDivergence
    }
}

export const RandomConvergentFunctionStep = (func: RandomConvergentFunction) : RandomConvergentFunction => {
    const {pastPoints, target, finalLength, stepSize, maxDivergence} = func
    let funcResult = {...func}
    if (finalLength > pastPoints.length){
        const currentPoint = pastPoints[pastPoints.length-1]
        const funcHeight = target - currentPoint
        const progress = pastPoints.length / finalLength
        const currentOptimal = pastPoints[0] + (progress * funcHeight)

        const distanceRemaining = finalLength - pastPoints.length
        let limitDistance = (distanceRemaining - 1) * stepSize
        let distanceFrom = target
        if (maxDivergence && maxDivergence < limitDistance) {
            limitDistance = maxDivergence
            distanceFrom = currentOptimal
        }

        const ceiling = distanceFrom + limitDistance
        const floor = distanceFrom - limitDistance
    }

    return funcResult
}