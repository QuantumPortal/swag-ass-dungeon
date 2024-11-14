console.log("Client script loaded.");

var hp;
var buttonAssociations;
var combat;
var enemyhp;
var activeEnemy;

// a function declaration inside of a callback ... which takes a callback function :O
function ajaxGET(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        value = this.responseText;
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            //console.log('responseText:' + xhr.responseText);

            // callback function
            value = this.responseText;
            callback(this.responseText);

        } else {
            console.log(this.status);
        }
    }
    xhr.open("GET", url, true);
    xhr.send();

}

function onRefresh() {
    document.getElementById("stylelink").href = "/css/style.css";
    ajaxGET("/layouts?name=main", function(data) {
        document.getElementById("container").innerHTML = data;
        let text = document.getElementById("shrek").innerHTML;
        let newText = "";

        let boozbol = 0;
        text.split('').map(function(char) {
            newText += `<span style="color:#${Math.random() < 0.5 ? "39FF14" : "c5ee7d"};font-size: ${2+Math.random()/5}vw${Math.random() < 0.186 ? ";text-shadow: 2px 2px 2px #e1dfb6" : ""}">${char}</span>`
            boozbol += 1;
            if (boozbol == 5) {
                newText += `<span style="background-color:rgb(255,0,0);font-size: 4px" >.</span>`
            }
        });

        document.getElementById("shrek").innerHTML = newText;
    });

    
}


document.addEventListener("DOMContentLoaded", onRefresh());


function blinkity() {
    Array.from(document.getElementsByClassName("bwuhButton")).forEach((button) => {
        //button.style.background = "#00AA00";
        let id = setInterval(function() {
            button.style.background = "#222222";
            clearInterval(id);
            updateButtons();
        },100);
        
    })
}

function enter() {
    ajaxGET("/layouts?name=console", function(data) {
        buttonAssociations = [
            "",
            "",
            "Next enemy",
            "",
            ""
        ];
        hp = 99;
        combat = false;

        document.getElementById("entering").innerHTML = "";
        document.getElementById("container").innerHTML += data;
        
        document.getElementById("footer").style.opacity = 0;
        updateHP()
        let a = 200
        let id = setInterval(function() {
            a -= 1 + Math.abs(a/12);
            document.getElementById("header").style.transform = `translateY(-${250-a}px)`;
           
            document.getElementById("footer").style.opacity = (200-a) / 200;
            if (a < 0) {
                document.getElementById("header").remove();
                clearInterval(id);
            }
        },10)
        



        document.getElementById("display").style.opacity = 0;

        let b = 0
        let id2 = setInterval(function() {
            b += 1 + b/70;
            document.getElementById("display").style.opacity = b / 100;
            if (b >= 100) {
                clearInterval(id2);
                blinkity()
            }
        }, 10)
       
        
        
        document.getElementById("bwuhButton1").addEventListener('click', function() {
            clickHandler(0);
        })
        document.getElementById("bwuhButton2").addEventListener('click', function() {
            clickHandler(1);
        })
        document.getElementById("bwuhButton3").addEventListener('click', function() {
            clickHandler(2);
        })
        document.getElementById("bwuhButton4").addEventListener('click', function() {
            clickHandler(3);
        })
        document.getElementById("bwuhButton5").addEventListener('click', function() {
            clickHandler(4);
        })
        

        
        
    });

}

function clickHandler(val) {
    if (buttonAssociations[val] == "Next enemy") {
        spawnEnemy()
        return
    } else if (combat == true) {
        switch(val) {
            case 0:
                attackEnemy("noscope");
                break;
            case 1:
                attackEnemy("sigma_reel");
                break;
            case 2:
                attackEnemy("tax_report");
                break;
            case 3:
                attackEnemy("tic_tacs");
                break;
            case 4:
                attackEnemy("used_needle");
                break;
        }
    }
    }

var enemies = ["waltuh","type_b","type_c","type_d","type_e"]

function spawnEnemy() {
    activeEnemy = enemies[Math.floor(Math.random()*enemies.length)];

    ajaxGET(`/enemies?enemy=${activeEnemy}`, function(enemyJson) {
        let parsedEnemy = JSON.parse(enemyJson)
        enemyhp = parsedEnemy.baseHP;
        document.getElementById("display").innerHTML = `
        <div id="enemy">
            <progress id="enemyhp" value="${parsedEnemy.baseHP}" max="${parsedEnemy.baseHP}"></progress>
            <img src="/img/${parsedEnemy.img}">
        </div>
        `
        combat = true
        buttonAssociations = [
            "noscope",
            "sigma_reel",
            "tax_report",
            "tic_tacs",
            "used_needle"
        ]
        updateButtons()
    })
}


function updateButtons() {
    Array.from(document.getElementsByClassName("bwuhButton")).forEach((button, index) => {
        let a = buttonAssociations[index]
        if (a == "Next enemy" || a == "") {
            button.innerHTML = `<p>${a}</p>`;
        }
        else {
            ajaxGET(`/attacks?type=${a}`, function(attackJson) {
                let parsedAttack = JSON.parse(attackJson)
                button.innerHTML = `<p>${parsedAttack.name}</p>`;
                
            })
        }
        
    })
    
}

var types = ["meth","mint","nostalgia","doomer","phonk"]

function attackEnemy(attack) {

    ajaxGET(`/attacks?type=${attack}`, function(attackJson) {
        parsedAttack = JSON.parse(attackJson);

        let damageArray = parsedAttack.damage;
        ajaxGET(`/enemies?enemy=${activeEnemy}`, function(enemyJson) {
            parsedEnemy = JSON.parse(enemyJson)
            for (let i = 0; i < 5; i++) {

                
                
                enemyhp -= ((100 - parsedEnemy.resistances[types[i]])/100) * damageArray[types[i]]

            }
            
            updateEnemyHP();
        })
        
    })

    
    

}


function updateHP() {
    document.getElementById("healthnum").innerHTML = hp;
}

function updateEnemyHP() {
    document.getElementById("enemyhp").value = Math.round(enemyhp);
    if (enemyhp <= 0) {
        combatFinish()
    }
}

function combatFinish() {
    combat = false
    buttonAssociations = [
        "",
        "",
        "Next enemy",
        "",
        ""
    ];

    document.getElementById("enemy").remove();
    updateButtons();
}
