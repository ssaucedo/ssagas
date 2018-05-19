


const starts = [
    {
        designation: 'Bayer',
        name: 'Gamma Arietis'
    },
    {
        designation: 'Flamsteed',
        name: '21',
    }
]


const service =  {
    getStars: () => new Promise(resolve => {
        setTimeout(() => resolve(starts), 2000)
    })
}


export default service;
