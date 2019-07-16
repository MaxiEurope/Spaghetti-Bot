exports.cDisabled = (var1, var2) => {

    let cchannel = var1,
        commandID = var2;
    let isDisabled = false;

    if (commandID == 1 && cchannel.c1 == true) isDisabled = true;
    else if (commandID == 2 && cchannel.c2 == true) isDisabled = true;
    else if (commandID == 3 && cchannel.c3 == true) isDisabled = true;
    else if (commandID == 4 && cchannel.c4 == true) isDisabled = true;
    else if (commandID == 5 && cchannel.c5 == true) isDisabled = true;
    else if (commandID == 6 && cchannel.c6 == true) isDisabled = true;
    else if (commandID == 7 && cchannel.c7 == true) isDisabled = true;
    else if (commandID == 8 && cchannel.c8 == true) isDisabled = true;
    else if (commandID == 9 && cchannel.c9 == true) isDisabled = true;
    else if (commandID == 10 && cchannel.c10 == true) isDisabled = true;
    else if (commandID == 11 && cchannel.c11 == true) isDisabled = true;
    else if (commandID == 12 && cchannel.c12 == true) isDisabled = true;
    else if (commandID == 13 && cchannel.c13 == true) isDisabled = true;
    else if (commandID == 14 && cchannel.c14 == true) isDisabled = true;
    else if (commandID == 15 && cchannel.c15 == true) isDisabled = true;
    else if (commandID == 16 && cchannel.c16 == true) isDisabled = true;
    else if (commandID == 17 && cchannel.c17 == true) isDisabled = true;
    else if (commandID == 18 && cchannel.c18 == true) isDisabled = true;
    else if (commandID == 19 && cchannel.c19 == true) isDisabled = true;
    else if (commandID == 20 && cchannel.c20 == true) isDisabled = true;

    return isDisabled;
}