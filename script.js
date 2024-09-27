const { createApp } = Vue;

createApp({
    data() {
        return {
            hero: { life: 100, attack: getRandomAttack(12), mana: 100, name: 'Anna', potionCount: 3, potionHeal: getRandomHeal(20), defense: false },
            heroSprite: 'Assets/Duelista-1-MovingSprite.gif',
            originalHeroSprite: 'Assets/Duelista-1-MovingSprite.gif',
            attackHeroGif: 'Assets/Gif-Duelista-1.gif',
            specialHeroGif: 'Assets/Gif-Duelista-1.gif',

            villain: { life: 200, attack: getRandomAttack(17), name: 'Demon', defense: false },
            villainSprite: 'Assets/Demon-Idle.gif',
            originalVillainSprite: 'Assets/Demon-Idle.gif',
            attackVillainGif: 'Assets/Demon-Attack.gif',

            isMusicPlaying: false,
            isHero: true,
            isActionAllowed: true,
            isVictory: false,
            isDefeat: false,
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
            return Math.max((this.villain.life / 200) * 100, 0);
        }
    },

    methods: {
        attack() {
            if (this.isHero && this.isActionAllowed === true) {
                this.disableActionsForDuration(2400);

                let damage = this.hero.attack;
                
                if (this.villain.defense === true) {
                    this.villain.defense = false;
                    damage = Math.round(this.hero.attack / 4);
                }

                this.heroSprite = this.attackHeroGif;
                
                setTimeout(() => {
                    this.heroSprite = this.originalHeroSprite;  
                    
                    this.isHero = false;
                    this.hero.mana = Math.min(this.hero.mana + 10, 100);
                    this.villain.life = Math.max(this.villain.life - damage, 0);
    
                    if (this.villain.life === 0) {
                        this.isVictory = true;
                    } else {
                        this.villainAction();
                    }
                }, 2400);
            } 
            else if (this.isHero === false && this.isActionAllowed === true) {
                this.disableActionsForDuration(1100);

                let damage = this.villain.attack;

                if (this.hero.defense === true) {
                    this.hero.defense = false;
                    damage = Math.round(this.villain.attack / 4);
                }

                this.villainSprite = this.attackVillainGif;
    
                setTimeout(() => {
                    this.villainSprite = this.originalVillainSprite;

                    this.hero.life = Math.max(this.hero.life - damage, 0);

                    if (this.hero.life === 0) {
                        this.isDefeat = true;
                    }
                }, 950);
                this.isHero = true;
            }
        },
        defense() {
            if (this.isHero && this.isActionAllowed === true) {
                this.hero.defense = true;
                this.isHero = false;
                this.disableActionsForDuration(1000);
                setTimeout(() => {
                    this.villainAction();
                    this.hero.mana = Math.min(this.hero.mana + 10, 100);
                }, 1100);
            } else if (!this.isHero && this.isActionAllowed === true) {
                this.villain.defense = true;
                this.disableActionsForDuration(1000);
                setTimeout(() => {
                    this.isHero = true;
                }, 1100);
            }
        },
        usePotion() {
            if (this.hero.potionCount > 0) {
                if (this.hero.life === 100) {
                    alert('You are already at full health!');
                } else if (this.hero.life >= 84) {
                    this.hero.life = 100;
                    this.hero.potionCount--;
                    this.hero.mana = Math.min(this.hero.mana + 10, 100);
                } else if (this.hero.life < 84) {
                    this.hero.life = Math.min(this.hero.life + this.hero.potionHeal, 100);
                    this.hero.potionCount--;
                    this.hero.mana = Math.min(this.hero.mana + 10, 100);
                }
            }
        },
        special() {
            if (this.isHero && this.isActionAllowed === true && this.hero.mana >= 40) {
                this.disableActionsForDuration(3500);
                
                let damage = this.hero.attack * 2.5;
                
                if (this.villain.defense === true) {
                    this.villain.defense = false;
                    damage = Math.round(this.hero.attack / 1.2);
                }

                this.heroSprite = this.specialHeroGif;
                
                setTimeout(() => {
                    this.heroSprite = this.originalHeroSprite;
                    
                    this.isHero = false;
                    this.hero.mana = Math.max(this.hero.mana - 40, 0);
                    this.villain.life = Math.max(this.villain.life - damage, 0);

                    if (this.villain.life === 0) {
                        this.isVictory = true;
                    } else {
                        this.villainAction();
                    }
                }, 3500);
            } 
        },

        villainAction() {
            const action = ['attack', 'defense'];
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
            this.villain.life = 200;
            this.hero.potionCount = 3;
            this.isVictory = false;
            this.isDefeat = false;
            this.isHero = true;
            this.isActionAllowed = true;
        },

        disableActionsForDuration(duration) {
            this.isActionAllowed = false;
            setTimeout(() => {
                this.isActionAllowed = true;
            }, duration);
        },

        getPotionImage(index) {
            return index <= this.hero.potionCount ? 'Assets/Potion.png' : 'Assets/Potion-Used.png';
        }
    }
}).mount('#app');