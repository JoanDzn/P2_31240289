document.getElementById('searchInput').addEventListener('keyup', function() {
            const filter = this.value.toLowerCase();
            const rows = document.querySelectorAll('table tbody tr');
            rows.forEach(row => {
                const name = row.querySelector('td:nth-child(1)')?.textContent?.toLowerCase() || '';
                const email = row.querySelector('td:nth-child(2)')?.textContent?.toLowerCase() || '';
                if (name.includes(filter) || email.includes(filter)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });