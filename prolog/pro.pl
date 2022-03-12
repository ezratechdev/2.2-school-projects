go:-
hypothesis(Disease),
write('the plant suffers from'),
nl,
write(Disease),
nl,
write('recheck it'),
undo.

hypothesis(powderyMildew) :- powderyMildew, !. 
hypothesis(collarRot) :- collarRot, !.
hypothesis(fusariumWilt) :- fusariumWilt, !. 
hypothesis(lentilRust) :- lentilRust, !.
hypothesis(mosaicVirus) :- mosaicVirus, !.

hypothesis(unknown).

collarRot:-
verify(chlorotic_and_wilted_upper_plant_parts),
verify(necrotic_plant),
verify(death_of_plant),
verify(white_leisons_on_stem),
verify(fluffy_white_growth_on_the_stem),
write('Advices and Suggestions:'),
nl,
write('1:Acid spray'),
nl,
write('2:nitric spray'),
nl,
write('3:GMO spray'),
nl.



mosaicVirus:-
verify(mosaic_and_chlorotic_vein_flecking),
verify(veinal_enations),
verify(stunted_growth_of_plant),
verify(molting_of_foliage),
verify(yellowing_of_leaves_between_the_veins),
verify(proliferation_of_basal_branches),
verify(splitting_open_of_pods),
verify(prominent_enations),
verify(yellowing_of_stipules),
write('Advices and Suggestions:'),
nl,
write('1:Acid spray'),
nl,
write('2:nitric spray'),
nl,
write('3:GMO spray'),
nl.

fusariumWilt:-
verify(seed_rot),
verify(complete_yellowing),
verify(shrivelling_seeds),
verify(drooping_and_wilting_of_leaflets),
write('Advices and Suggestions:'),
nl,
write('1:Acid spray'),
nl,
write('2:nitric spray'),
nl,
write('3:GMO spray'),
nl.

lentilRust:-
verify(white_pustules_on_leaves),
verify(yellowish_slightly_raised_pustules),
write('Advices and Suggestions:'),
nl,
write('1:Acid spray'),
nl,
write('2:nitric spray'),
nl,
write('3:GMO spray'),
nl.

powderyMildew:-
verify(gray-white_areas_covering_entire_plant),
verify(death_of_a_plant),
write('Advices and Suggestions:'),
nl,
write('1:Acid spray'),
nl,
write('2:nitric spray'),
nl,
write('3:GMO spray'),
nl.

        ask(Question):-
        write('Does the plant have the following symptoms:'),
        write(Question),
        write('? '),
        read(Response),
        nl,
        ((Response == yes ; Response == y)
->
     assert(yes(Question));
     assert(no(Question)), fail).

     :- dynamic yes/1,no/1.
        /*how to verify something*/
        verify(S) :-
        (yes(S))
        ->
        true;
        (no(S))
        ->
        fail;
        (ask(S)).

    /*undo all yes/no assertions*/
    undo:-retract(yes(_)),fail.
    undo:-retract(no(_)),fail.
    undo.
        


    
