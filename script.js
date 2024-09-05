const {createApp} = Vue;

createApp({
    data() {
        return {
            hero: {life: 100, attack: getRandomAttack(12), mana: 100, name: 'Anna'},
            villain: {life: 76, attack: getRandomAttack(5), name: 'Goblin'},
        }

        function getRandomAttack(baseAttack) {
            const minModifier = 0.9; // 10% less
            const maxModifier = 1.3; // 30% more
            const randomModifier = Math.random() * (maxModifier - minModifier) + minModifier;
            return Math.round(baseAttack * randomModifier);
        }
    },

    methods: {
        attack(isHero){
            this.hero.life -= this.villain.attack;
        },
        defense(isHero){
            this.villain.life -= this.hero.attack;
        },
        usePotion(isHero){
            this.hero.life += 10;
        },
        special(isHero){
            this.villain.life -= this.hero.attack * 2;
            this.hero.mana -= 40;
        },
        flee(isHero){

        },

        villainAction() {
            const action = ['attack', 'defense', 'usePotion', 'flee'];
            const randomAction = action[Math.floor(Math.random() * action.length)];
            this[randomAction](false);
        }



    }


}).mount('#app');