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
    let prunning = 0, pinterrumpible = 0, puninterrumpible = 0, pstopped = 0, ptraced = 0, pzombie = 0, pdead = 0, pnoninteractive = 0, punknown = 0, ptotal = 0

    const getStats = () => {
        fetch('/api')
        .then((response) => {
            response.text()
            .then((text) => {
                const [ total, free, consumed ] = text.split(',')
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

                $('#av-ram').text(totalMB.toFixed(2))
                $('#used-ram').text(consumedMB.toFixed(2))
                $('#ram-percentage').text(percent.toFixed(2) + '%')

                chart.render()
            })
        })
    }

    const getProcess = () => {
        fetch('/api/process')
        .then((response) => {
            response.text()
            .then((text) => {
                //reset ui
                $('#ptable').html('')
                prunning  = 0
                pinterrumpible = 0
                puninterrumpible = 0
                pstopped = 0
                ptraced = 0
                pzombie = 0
                pdead = 0
                pnoninteractive = 0
                punknown = 0
                ptotal = 0

                //update ui
                const lines = text.split('\n')
                ptotal = lines.length

                lines.forEach(line => {
                    const [name, pid, state, cpu] = line.split(' ')
                    const stateFriendly = getStateName(state)
                    $("#pTotal").text(ptotal)
                    $("#pRunning").text(prunning)
                    $("#pInterrumpible").text(pinterrumpible)
                    $("#pUninterrumpible").text(puninterrumpible)
                    $("#pStopped").text(pstopped)
                    $("#pTraced").text(ptraced)
                    $("#pZombie").text(pzombie)
                    $("#pDead").text(pdead)
                    $("#pNoninteractive").text(pnoninteractive)
                    $("#pUnknown").text(punknown)
                    $('#ptable').append(`<tr><td>${pid}</td><td>${name}</td><td>${stateFriendly}</td><td>${cpu}</td></tr>`)
                });
            })
        })
    }

    const getStateName = (id) => {
        switch(id) {
            case '0':
                prunning++
                return 'Running'
            case '1':
                console.log(pinterrumpible) 
                pinterrumpible++
                console.log(pinterrumpible) 
                return 'Interrumpible'
            case '2':
                puninterrumpible++
                return 'Uninterrumpible'
            case '4':
                pstopped++
                return 'Stopped'
            case '8':
                ptraced++
                return 'Traced'
            case '16':
                pzombie++
                return 'Zombie'
            case '32':
                pdead++
                return 'Dead'
            case '64':
                pnoninteractive++
                return 'Noninteractive'
            default:
                punknown++
                return ' ¯\\_(ツ)_/¯  (' + id + ')'
        }
    }

    setInterval(getProcess, 1500)
    setInterval(getStats, 1000)
})