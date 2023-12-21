var guCCTVCount = [];

fetch('./json/guCCTV.json')
                .then(res => res.json())
                .then(data => {
                    guCCTVCount = data;
                })