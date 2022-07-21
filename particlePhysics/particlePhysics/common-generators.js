/*
PUT PARTICLES ON A GIVEN SPACING GRID
*/ 
export function putIndexOnASpacedGrid(rows, cols, colspacing, rowspacing, initialX = 0, initialY = 0) {

    let positionsByIndex = [];

    for(let i=0; i<rows; i++){
        for(let j=0; j<cols; j++){
            let position = vec(j*colspacing+initialX, i*rowspacing+initialY);
            positionsByIndex.push(position);
        }
    }

    return (i) => positionsByIndex[i];

}