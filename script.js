const { createApp } = Vue;

createApp({
    data() {
        return {
            hero: { life: 100, attack: getRandomAttack(12), mana: 100, name: 'Anna' },
            heroSprite: 'Assets/Duelista-1-MovingSprite.gif',
            originalHeroSprite: 'Assets/Duelista-1-MovingSprite.gif',
            attackHeroGif: 'Assets/Gif-Duelista-1.gif',
            specialHeroGif: 'Assets/Gif-Duelista-1.gif',

            villain: { life: 100, attack: getRandomAttack(10), name: 'Goblin' },
            villainSprite: 'Assets/SpearGoblin-sprite.png',
            originalVillainSprite: 'Assets/SpearGoblin-sprite.png',
            attackVillainGif: 'Assets/Gif-SpearGoblin.gif',

            isMusicPlaying: false
        }

        function getRandomAttack(baseAttack) {
            const minModifier = 0.9;
            const maxModifier = 1.3;
            const randomModifier = Math.random() * (maxModifier - minModifier) + minModifier;
            return Math.round(baseAttack * randomModifier);
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
        attack(isHero) {
            const damage = this.hero.attack;
            this.villain.life = Math.max(this.villain.life - damage, 0);

            this.heroSprite = this.attackHeroGif;

            setTimeout(() => {
                this.heroSprite = this.originalHeroSprite;  
            }, 2400);
            // this.villainAction();
        },
        defense(isHero) {
            this.hero.life -= this.hero.attack - this.villain.attack;
            // this.villainAction();
        },
        usePotion(isHero) {
            if(this.hero.life === 100){
                'You are already at full health!'
            } else if(this.hero.life >= 80){
                this.hero.life = 100;
            } else if(this.hero.life < 80){
                this.hero.life += 20;
            } else if (this.hero.life + 20 > 100) {
                this.hero.life = 100;
            }
            // this.villainAction();
        },
        special(isHero) {
            if (this.hero.mana >= 40) {
                const damage = (this.hero.attack * 2)
                this.villain.life = Math.max(this.villain.life - damage, 0);
                this.hero.mana = Math.max(this.hero.mana - 40, 0);

                this.heroSprite = this.specialHeroGif;

                setTimeout(() => {
                    this.heroSprite = this.originalHeroSprite;
                }, 4000);
                // this.villainAction();
            }
        },
        flee(isHero) {

        },

        villainAction() {
            const action = ['attack', 'defense', 'usePotion', 'flee'];
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
    }


}).mount('#app');