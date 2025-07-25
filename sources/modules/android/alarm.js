class Constant {
    
    #value;

    constructor(value) {
        this.#value = value;
        return Object.freeze(this);
    }

    get value() {
        return this.#value;
    }

    valueOf() {
        return this.#value;
    }

    #create(value) {

        var extended = class Value extends Constant {

            static #base = Object.getPrototype(value);
            
            constructor() {
                super(value)
            }

            static get [Symbol.species]() {
                return this.#base;
            }
            
            static [Symbol.hasInstance](value) {
                return typeof.isInteger(value);
    }
            
        }
        var constant = class 

    

};



class Alarm {

    #hours = new Date().getHours();
    #minutes = new Date().getMinutes();
    #message = "";

    constructor(hours, minutes, message) {
        this.#hours = hours;
        this.#minutes = minutes;
        this.#message = message;
    }

    get hours() {
        return this.#hours;
    }

    set hours(value) {
        this.#hours = value;
    }

    get minutes() {
        return this.#minutes;
    }

    set minutes(value) {
        this.#minutes = value;
    }

    get message() {
        return this.#message
    }

    set message(value) {
        this.#message = value;
    }

};

class Constant {

    #value;

    constructor(value) {
        this.#value = value;
        return Object.freeze(this);
    }

    get value() {
        return this.#value;
    }

    valueOf() {
        return this.#value;
    }

}

static get [Symbol.species]() {
        return Number;
    }

    static [Symbol.hasInstance](value) {
        return Number.isInteger(value);
    }

Alarm.Datum = Object.freeze({
    HOUR: Symbol("android.intent.extra.alarm.HOUR"),
    MINUTES: Symbol("android.intent.extra.alarm.MINUTES"),
    MESSAGE: Symbol("android.intent.extra.alarm.MESSAGE"),
    VIBRATE: Symbol("android.intent.extra.alarm.VIBRATE"),
    SKIPUI: Symbol("android.intent.extra.alarm.SKIP_UI"),
    WEEKDAYS: Symbol("android.intent.extra.alarm.DAYS"),

});

class WeekDay {

    #value;
    
    constructor(value) {
        this.#value = Object.freeze(value);
    }

    

    valueOf() {
        return this.#value;
    }

    static Sunday = WeekDay(1);
    static Monday = WeekDay(2);
    static Tuesday = WeekDay(3);
    static Wednesday = WeekDay(4);
    static Thursday = WeekDay(5);
    static Friday = WeekDay(6);
    static Saturday = WeekDay(7);

};

/*



var AndroidAlarm = {
/**
    Create an alarm
    @param {number} hour - The hour for the alarm.
    @param {number} minutes - The minutes for the alarm.
    @param {string} message - A custom message to identify the alarm.
    @param {Arguments} options - Extra options
    You can specify extra alarm options:
      {Array} days - An Array including each week day on which this alarm should be repeated. Each day must be declared with an integer.
      {bool} vibrate - A boolean specifying whether to vibrate for this alarm.
      {bool} skipUI - A boolean specifying whether the responding app should skip its UI when setting the alarm. 
      
    @example
    AndroidAlarm.create( 12 , 30 ,  "My alarm" , {days:[2,3], vibrate:true});
    */
   /*
    create: function(hour, minutes, message, options) {
        i = intent("android.intent.action.SET_ALARM");
        i.extraInt("android.intent.extra.alarm.HOUR", hour);
                i.extraInt("android.intent.extra.alarm.MINUTES", minutes);

        if (message !== undefined)
            i.extra("android.intent.extra.alarm.MESSAGE", message);
        if (options !== undefined) {
            if (options.days !== undefined)
                i.extraArrayInt("android.intent.extra.alarm.DAYS", options.days);
            if (options.vibrate !== undefined)
                i.extraBool("android.intent.extra.alarm.VIBRATE", options.vibrate);
            if (options.skipUI !== undefined)
                i.extraBool("android.intent.extra.alarm.SKIP_UI", options.skipUI);
        }
        i.send();
    },
    
   /**
    Create a timer
    @param {number} length - The length of the timer in seconds.
    @param {string} message -A custom message to identify the timer.
    @param {bool} skipUI - A boolean specifying whether the responding app should skip its UI when setting the timer. 
      
    @example
    AndroidAlarm.timer(30);
    */
   /*
    timer: function(length, message, skipUI) {
        i = intent("android.intent.action.SET_TIMER");
        i.extraInt("android.intent.extra.alarm.LENGTH", length);    
        if (message !== undefined)
            i.extra("android.intent.extra.alarm.MESSAGE", message);
        if (skipUI !== undefined)
            i.extraBool("android.intent.extra.alarm.SKIP_UI", skipUI);
        i.send();
    }
    
};
*/
