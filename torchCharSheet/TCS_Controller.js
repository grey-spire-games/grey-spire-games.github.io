var app = angular.module('TCS', []);

app.controller('MainController', function () {

    var Main = this;

    const SumMods = ModArray => ModArray.reduce((a, b) => a + b.Get(), 0);
    const FindMods = Name => Character.ModStack.filter(obj => {
        return obj.Name == Name
    });
    const GetMods = Name => SumMods(FindMods(Name));

    function Stat_Block(name, base, get) {
        this.Name = name;
        this.Base = base;
        this.Get = get
        this.Training = 0;
    };

    function Mod_Block(name, value) {
        this.Name = name,
            this.Value = value,
            this.Get = function () {
                return this.Value
            },
            this.DeleteCallback = function () {
                Character.ModStack.splice(Character.ModStack.indexOf(this), 1)
            }
    };

    function Trait_Block(name, value, description) {
        this.Name = name;
        this.Value = value
        this.Description = description
        this.Mods = []
        this.Get = function () {
            return this.Value
        }
        this.CreateMod = function (modName, modValue) {
            var mod = new Mod_Block(modName, modValue)
            this.Mods.push(mod)
            Character.ModStack.push(mod)
        }
        this.Delete = function () {
            this.Mods.forEach(mod => {
                mod.DeleteCallback()
            });
            this.Mods = []
            Character.Traits.splice(Character.Traits.indexOf(this), 1)
        }

    };

    var Character =

        {
            Name: 'Zajitsu Aone',
            Concept: 'Sportsball Mercenary',
            Level: 1,
            Exp: 0,
            Health: 0,
            Mana: 0,

            Traits: [],
            Stats: [],


            GetStat: function (name) {
                if (typeof (this.Stats.find(Stat => Stat.Name == name)) !== "undefined")
                    return this.Stats.find(Stat => Stat.Name == name).Get("All")
                else
                    return null
            },
            GetStatBase: function (name) {
                if (typeof (this.Stats.find(Stat => Stat.Name == name)) !== "undefined")
                    return this.Stats.find(Stat => Stat.Name == name).Get("Base")
                else
                    return null
            },
            GetStatMods: function (name) {
                if (typeof (this.Stats.find(Stat => Stat.Name == name)) !== "undefined")
                    return this.Stats.find(Stat => Stat.Name == name).Get("Mods")
                else
                    return null
            },
            IncreaseStat: function (name) {
                if (typeof (this.Stats.find(Stat => Stat.Name == name)) !== "undefined")
                    return this.Stats.find(Stat => Stat.Name == name).Training = this.Stats.find(Stat => Stat.Name == name).Training + 1
                else
                    return null
            },
            DecreaseStat: function (name) {
                if (typeof (this.Stats.find(Stat => Stat.Name == name)) !== "undefined")
                    return this.Stats.find(Stat => Stat.Name == name).Training = this.Stats.find(Stat => Stat.Name == name).Training - 1
                else
                    return null
            },
            GetTrait: function (name) {
                if (typeof (this.Traits.find(Traits => Traits.Name == name)) !== "undefined")
                    return this.Traits.find(Trait => Trait.Name == name).Get()
                else
                    return null
            },
            GetTraitValue: function (name) {
                if (typeof (this.Traits.find(Traits => Traits.Name == name)) !== "undefined")
                    return this.Traits.find(Trait => Trait.Name == name).Value
                else
                    return ""
            },

            AddStat: function (Stat) {
                var newStat = new Stat_Block(Stat.Name, Stat.Base, Stat.Get)
                this.Stats.push(newStat)
            },
            AddTrait: function (Trait) {
                var newTrait = new Trait_Block(Trait.Name, Trait.Value, Trait.Description)
                Trait.Mods.forEach(mod => {
                    newTrait.CreateMod(mod.Name, mod.Value)
                });
                this.Traits.push(newTrait)
            },
            DeleteTrait: function (name) {

                if (typeof (this.Traits.find(Traits => Traits.Name == name)) !== "undefined") {
                    this.Traits.find(Trait => Trait.Name == name).Delete()
                } else
                    return null

            },

            ModStack: []
        }




    Main.combatMods = [{
            Name: "",
            Value: "",
        },
        {
            Name: "Combat",
            Description: "",
            Value: "Strength",
            Mods: [{
                Name: "CombatModifier",
                Value: 5
            }]
        },
        {
            Name: "Combat",
            Description: "",
            Value: "Dexterity",
            Mods: [{
                Name: "CombatModifier",
                Value: 3
            }]
        },
        {
            Name: "Combat",
            Description: "",
            Value: "Intellect",
            Mods: [{
                Name: "CombatModifier",
                Value: 2
            }]
        }
    ]

    Main.spellMods = [{
            Name: "",
            Value: "",
        },
        {
            Name: "SpellCasting",
            Description: "",
            Value: "Intellect",
            Mods: [{
                Name: "MaxMana",
                Value: 4
            }]
        },
        {
            Name: "SpellCasting",
            Description: "",
            Value: "Spirit",
            Mods: [{
                Name: "ManaRegen",
                Value: 2
            }]
        }
    ]

    Main.CombatSelector = Main.combatMods[0];
    Main.CombatChange = function () {
        Character.DeleteTrait("Combat")
        if (Main.CombatSelector.Value != "")
            Character.AddTrait(Main.CombatSelector)
    }
    Main.SpellCastSelector = Main.spellMods[0];
    Main.SpellCastChange = function () {
        Character.DeleteTrait("SpellCasting")
        if (Main.SpellCastSelector.Value != "")
            Character.AddTrait(Main.SpellCastSelector)
    }


    //Modifiers Stats
    Character.Stats.push(
        new Stat_Block("CombatModifier", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat(Character.GetTraitValue("Combat"))
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat(Character.GetTraitValue("Combat"))
        }),
        new Stat_Block("SpellModifier", 2, function (type) {
            if (Character.GetTraitValue("SpellCasting") != "") {
                if (type == "All")
                    return this.Base + this.Training + GetMods(this.Name) + Character.GetStat(Character.GetTraitValue("SpellCasting"))
                else if (type == "Base")
                    return this.Base + this.Training
                else if (type == "Mods")
                    return 0 + GetMods(this.Name) + Character.GetStat(Character.GetTraitValue("SpellCasting"))
            } else
                return 0
        })
    );

    //Wierd Stats
    Character.Stats.push(
        new Stat_Block("MaxHealth", 20, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + (3 * Character.Level) + (6 * Character.GetStat("Stamina"))
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + (3 * Character.Level) + (6 * Character.GetStat("Stamina"))
        }),
        new Stat_Block("MaxMana", 0, function (type) {
            if (Character.GetTraitValue("SpellCasting") != "") {
                if (type == "All")
                    return this.Base + this.Training + GetMods(this.Name) + (3 * Character.Level) + (4 * Character.GetStat("SpellModifier"))
                else if (type == "Base")
                    return this.Base + this.Training
                else if (type == "Mods")
                    return 0 + GetMods(this.Name) + (3 * Character.Level) + (4 * Character.GetStat("SpellModifier"))
            } else
                return 0
        }),
        new Stat_Block("HealthRegen", 1, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Stamina")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Stamina")
        }),
        new Stat_Block("ManaRegen", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("SpellModifier")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("SpellModifier")
        }),
        new Stat_Block("Defense", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("UnDefense")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("UnDefense")
        }),
        new Stat_Block("UnDefense", 12, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Dexterity")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Dexterity")
        })
    );


    //Main Stats
    Character.Stats.push(
        new Stat_Block("Strength", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name)
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name)
        }),
        new Stat_Block("Dexterity", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name)
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name)
        }),
        new Stat_Block("Stamina", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name)
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name)
        }),
        new Stat_Block("Intellect", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name)
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name)
        }),
        new Stat_Block("Spirit", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name)
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name)
        }),
        new Stat_Block("Charisma", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name)
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name)
        })
    );


    //Strength Stats
    Character.Stats.push(
        new Stat_Block("Athletics", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Strength")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Strength")
        }),
        new Stat_Block("Intimidation", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Strength")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Strength")
        }),
        new Stat_Block("Might", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Strength")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Strength")
        })
    );

    //Dexterity Stats
    Character.Stats.push(
        new Stat_Block("Acrobatics", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Dexterity")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Dexterity")
        }),
        new Stat_Block("Burglary", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Dexterity")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Dexterity")
        }),
        new Stat_Block("Craftsmanship", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Dexterity")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Dexterity")
        }),
        new Stat_Block("Stealth", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Dexterity")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Dexterity")
        })
    );

    //Stamina Stats
    Character.Stats.push(
        new Stat_Block("Endurance", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Stamina")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Stamina")
        }),
        new Stat_Block("Fortitude", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Stamina")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Stamina")
        }),
        new Stat_Block("Toughness", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Stamina")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Stamina")
        })
    );

    //Intellect Stats
    Character.Stats.push(
        new Stat_Block("Arcana", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Intellect")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Intellect")
        }),
        new Stat_Block("Knowledge", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Intellect")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Intellect")
        }),
        new Stat_Block("Observation", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Intellect")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Intellect")
        }),
        new Stat_Block("Research", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Intellect")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Intellect")
        })
    );

    //Spirit Stats
    Character.Stats.push(
        new Stat_Block("Insight", 0, function (type) {
            console.log(type)
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Spirit")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Spirit")
        }),
        new Stat_Block("Religion", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Spirit")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Spirit")
        }),
        new Stat_Block("Will", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Spirit")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Spirit")
        })
    );

    //Charisma Stats
    Character.Stats.push(
        new Stat_Block("Deception", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Charisma")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Charisma")
        }),
        new Stat_Block("Leadership", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Charisma")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Charisma")
        }),
        new Stat_Block("Performance", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Charisma")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Charisma")
        }),
        new Stat_Block("Persuasion", 0, function (type) {
            if (type == "All")
                return this.Base + this.Training + GetMods(this.Name) + Character.GetStat("Charisma")
            else if (type == "Base")
                return this.Base + this.Training
            else if (type == "Mods")
                return 0 + GetMods(this.Name) + Character.GetStat("Charisma")
        })
    );


    Main.Character = Character
});


app.directive('traitCreator', function () {
    return {
        restrict: 'E',
        scope: {
            traitc: '&'
        },
        templateUrl: 'Templates/traitCreator.html',
        link: function (scope) {
            scope.Mods = []

            scope.AddMod = function () {
                var newMod = {
                    Name: scope.ModName,
                    Value: scope.ModValue
                }
                scope.Mods.push(newMod)
            }

            scope.AddTrait = function () {
                scope.Trait = {}
                scope.Trait.Name = scope.TraitName,
                    scope.Trait.Description = scope.TraitValue,
                    scope.Trait.Mods = scope.Mods

                scope.traitc({
                    Trait: scope.Trait
                })

                scope.Mods = []
                scope.TraitName = ""
                scope.TraitValue = ""

            }
        }
    };
});