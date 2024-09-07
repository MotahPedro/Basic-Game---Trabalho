const { createApp } = Vue;

createApp({
    data() {
        return {
            hero: { life: 100, attack: getRandomAttack(12), mana: 100, name: 'Anna', potionCount: 3, potionHeal: getRandomHeal(20) },
            heroSprite: 'Assets/Duelista-1-MovingSprite.gif',
            originalHeroSprite: 'Assets/Duelista-1-MovingSprite.gif',
            attackHeroGif: 'Assets/Gif-Duelista-1.gif',
            specialHeroGif: 'Assets/Gif-Duelista-1.gif',

            villain: { life: 100, attack: getRandomAttack(10), name: 'Goblin' },
            villainSprite: 'Assets/SpearGoblin-sprite.png',
            originalVillainSprite: 'Assets/SpearGoblin-sprite.png',
            attackVillainGif: 'Assets/Gif-SpearGoblin.gif',

            isMusicPlaying: false,
            isHero: true,
            isActionAllowed: true,
        }

        function getRandomAttack(baseAttack) {
            const minModifier = 0.9;
            const maxModifier = 1.3;
            const randomModifier = Math.random() * (maxModifier - minModifier) + minModifier;
            return Math.round(baseAttack * randomModifier);
        }

        function getRandomHeal(baseHeal) {
            const minModifier = 0.8;
            const maxModifier = 1.2;
            const randomModifier = Math.random() * (maxModifier - minModifier) + minModifier;
            return Math.round(baseHeal * randomModifier);
        }
    },

    mounted() {
        this.playMusic();
    },

    computed: {
        heroLifePercentage() {
            return Math.max((this.hero.life / 100) * 100, 0);
        },
        heroManaPercentage() {
            return Math.max((this.hero.mana / 100) * 100, 0);
        },
        villainLifePercentage() {
            return Math.max((this.villain.life / 100) * 100, 0);
        }
    },

    methods: {
        attack() {

            if (this.isHero && this.isActionAllowed === true) {
                this.disableActionsForDuration(2400);

                
                const damage = this.hero.attack
                this.villain.life = Math.max(this.villain.life - damage, 0);
    
                this.heroSprite = this.attackHeroGif;
                
                setTimeout(() => {
                    this.heroSprite = this.originalHeroSprite;  
                    
                    this.isHero = false;
                    this.hero.mana = Math.min(this.hero.mana + 10, 100);
    
                    if (this.villain.life === 0) {
                        this.isVictory = true;
                    } else {
                        this.villainAction();
                    }
                }, 2400);

            } else if (this.isHero === false && this.isActionAllowed === true) {
                this.disableActionsForDuration(2500);
                const damage = this.villain.attack;
                this.hero.life = Math.max(this.hero.life - damage, 0);
    
                this.villainSprite = this.attackVillainGif;
    
                setTimeout(() => {
                    this.villainSprite = this.originalVillainSprite;
                }, 2400);
                this.isHero = true;
            }
        },
        defense() {
            if (this.isHero && this.isActionAllowed === true) {
                this.hero.life -= (this.villain.attack - this.hero.attack);
                this.isHero = false;
                this.hero.mana = Math.min(this.hero.mana + 10, 100);
                this.villainAction();
            } else if (this.isHero === false) {
                this.villain.life -= (this.hero.attack - this.villain.attack);
                this.isHero = true;
            }

        },
        usePotion() {
            if(this.hero.potionCount > 0){
                if(this.hero.life === 100){
                    'You are already at full health!'
                } else if(this.hero.life >= 84){
                    this.hero.life = 100;
                    this.hero.potionCount--;
                    this.hero.mana = Math.min(this.hero.mana + 10, 100);
                    // this.villainAction();
                } else if(this.hero.life < 84){
                    this.hero.life = Math.min(this.hero.life + this.hero.potionHeal, 100);
                    this.hero.potionCount--;
                    this.hero.mana = Math.min(this.hero.mana + 10, 100);
                    // this.villainAction();
                } else if (this.hero.life + this.hero.potionHeal > 100) {
                    this.hero.life = 100;
                    this.hero.mana = Math.min(this.hero.mana + 10, 100);
                    // this.villainAction();
                }
            }
        },
        special() {
            if (this.isHero && this.isActionAllowed === true && this.hero.mana >= 40) {
                this.disableActionsForDuration(4000);
                const damage = (this.hero.attack * 2)
                console.log(damage);
                
                this.villain.life = Math.max(this.villain.life - damage, 0);
                this.hero.mana = Math.max(this.hero.mana - 40, 0);

                this.heroSprite = this.specialHeroGif;

                setTimeout(() => {
                    this.heroSprite = this.originalHeroSprite;


                }, 4000);
                this.isHero = false;
                
                if (this.villain.life === 0) {
                    this.isVictory = true;
                } else {
                    this.villainAction();
                }
            } 
        },
        flee(isHero) {
            alert('You have fled the battle!');
        },

        villainAction() {
            const action = ['attack'];
            const randomAction = action[Math.floor(Math.random() * action.length)];

            this[randomAction](false);

        },

        playMusic() {
            const music = document.getElementById("backgroundMusic");
            if (!this.isMusicPlaying) {
                music.play();
                this.isMusicPlaying = true;
            }
        },
        pauseMusic() {
            const music = document.getElementById("backgroundMusic");
            if (this.isMusicPlaying) {
                music.pause();
                this.isMusicPlaying = false;
            }
        },

        restartBattle() {
            this.hero.life = 100;
            this.hero.mana = 100;
            this.villain.life = 100;
            this.hero.potionCount = 3;
            this.isVictory = false;
            this.isHero = true;
            this.isActionAllowed = true;
        },

        disableActionsForDuration(duration) {
            this.isActionAllowed = false;
            setTimeout(() => {
                this.isActionAllowed = true;
            }, duration);
        },
    }


}).mount('#app');