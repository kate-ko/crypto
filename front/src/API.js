const apiUrl = 'http://localhost:8080';

class APIclass {
    get_rates() {
        return fetch(`${apiUrl}/rates`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
    }

    get_history() {
        return fetch(`${apiUrl}/history`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
    }
}

module.exports = new APIclass()