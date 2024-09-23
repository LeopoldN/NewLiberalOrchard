fetch('pollingtableData.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(pollData => {
        $(document).ready(function() {
            const table = $('#pollingTable tbody');
            const getMarginColor = (margin) => {
                return margin.includes('D+') ? 'blue' : 'red';
            };
            
            // Add national data
            const nationalRow = `
                <tr>
                    <td>National</td>
                    <td>${pollData.national.Harris}%</td>
                    <td>${pollData.national.Trump}%</td>
                    <td>${pollData.national.margin}</td>
                    <td>${pollData.national.change_last_week}</td>
                </tr>`;
            table.append(nationalRow);
            
            // Add state data
            pollData.states.forEach(state => {
                const row = `
                    <tr>
                        <td>${state.state}</td>
                        <td>${state.Harris}%</td>
                        <td>${state.Trump}%</td>
                        <td style="color:${getMarginColor(state.margin)}">${state.margin}</td>
                        <td>${state.change_last_week}</td>
                    </tr>`;
                table.append(row);
            });
            
            // Initialize DataTable for sorting and search
            $('#pollingTable').DataTable();

            
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
