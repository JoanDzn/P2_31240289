   document.getElementById('searchInput').addEventListener('keyup', function() {
            const filter = this.value.toLowerCase();
            const rows = document.querySelectorAll('table tbody tr');
            rows.forEach(row => {
                const dates = row.querySelector('td:nth-child(7)')?.textContent?.toLowerCase() || '';
                const services = row.querySelector('td:nth-child(4)')?.textContent?.toLowerCase() || '';
                if (dates.includes(filter) || services.includes(filter)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
