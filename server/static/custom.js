$(function() {
    const dataPoints = []
    const chart = new CanvasJS.Chart('chartContainer', {
        title: {
            text: 'Porcentage de memoria'
        },
        data: [
            {
                type: 'line',
                dataPoints
            }
        ]
    })

    let x = 0
    let y = 0

    const getStats = () => {
        fetch("/api")
        .then((response) => {
            response.text()
            .then((text) => {
                const [ total, free, consumed ] = text.split(",")
                const totalMB = total / 1024
                const freeMB = free / 1024
                const consumedMB = consumed / 1024
                const percent = ((consumedMB * 100) / totalMB)

                y = percent
                x++
                
                dataPoints.push({ x, y })

                if(dataPoints.length > 50) {
                    dataPoints.shift()
                }

                $("#av-ram").text(totalMB.toFixed(2))
                $("#used-ram").text(consumedMB.toFixed(2))
                $("#ram-percentage").text(percent.toFixed(2) + "%")

                chart.render()
            })
        })
    }

    setInterval(getStats, 1000)
})