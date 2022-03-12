symptom('seed rot').
symptom('complete yellowing').
symptom('shrivelling seeds').
symptom('drooping and wilting of leaflets').
symptom('reduced proliferation and nodulation rate').
symptom('white pustules on leaves').
symptom('yellowish slightly raised pustules').
symptom('grey to tan spots on leaflets').
symptom('grey to tan spots on the stems').
symptom('grey to tan spots on the flowers').
symptom('grey to tan spots on the pods').
symptom('wilting').
symptom('browning of the leaves').
symptom('dying of the leaves').
symptom('tan lesions with dark borders on leaves').
symptom('premature drop of leaves').
symptom('tan to light brown leisons on stem').
symptom('tan to light brown leisons on pods').
symptom('discoloured seeds').
symptom('non-emergent seedling').
symptom('light brown seedlings').
symptom('light brown to red water soaked roots and stem').
symptom('death of plant').
symptom('drying up of a plant').
symptom('stunted growth of a plant').
symptom('rotting tap root and lateral roots').
symptom('gray-white areas covering entire plant').
symptom('death of a plant').
symptom('chlorotic and wilted upper plant parts').
symptom('necrotic plant').
symptom('death of plant').
symptom('white leisons on  stem').
symptom('fluffy white growth on the stem').
symptom('mosaic and chlorotic vein flecking').
symptom('veinal enations').
symptom('stunted growth of plant').
symptom('molting of foliage').
symptom('yellowing of leaves between the veins').
symptom('proliferation of basal branches').
symptom('splitting open of pods').
symptom('prominent enations').
symptom('yellowing of stipules').

input :- dynamic(plant/2),
    repeat,
    symptom(X),
    write('does the plant have '),
    write(X),
    write('? '),
    read(Y),
    assert(plant(X,Y)),
    \+ not(X='yellowing of stipules'),
    not(output).

disease(fusariumwilt):- 
    plant('seed rot',yes),
    plant('complete yellowing',yes),
    plant('shrivelling seeds',yes),
    plant('drooping and wilting of leaflets',yes),
    plant('reduced proliferation and nodulation rate',yes),
    plant('grey to tan spots on the flowers',yes),
    plant('grey to tan spots on the pods',yes).

disease(lentilrust):- 
    not(disease(fusariumwilt)),
    plant('white pustules on leaves',yes),
    plant('yellowish slightly raised pustules',yes).

disease(ascochytablight):-
    not(disease(fusariumwilt)),
    not(disease(lentilrust)),
    plant('grey to tan spots on leaflets',yes),
    plant('grey to tan spots on the stems',yes),
    plant('grey to tan spots on the flowers',yes),
    plant('grey to tan spots on the pods',yes),
    plant('wilting',yes),
    plant('browning of the leaves',yes),
    plant('dying of the leaves',yes).

disease(anthracnose):-
    not(disease(fusariumwilt)),
    not(disease(lentil)),
    not(disease(ascochytablight)),
    plant('tan lesions with dark borders on leaves',yes),
    plant('premature drop of leaves',yes),
    plant('tan to light brown leisons on stem',yes),
    plant('tan to light brown leisons on pods',yes),
    plant('discoloured seeds',yes).

disease(root_rot_and_seedling_disease):-
    not(disease(fusariumwilt)),
    not(disease(lentil)),
    not(disease(ascochytablight)),
    not(disease(anthracnose)),
    plant('non-emergent seedling',yes),
    plant('light brown seedlings',yes),
    plant('light brown to red water soaked roots and stem',yes),
    plant('death of plant',yes),
    plant('drying up of a plant',yes),
    plant('stunted growth of a plant',yes),
    plant('rotting tap root and lateral roots',yes).

disease(powdery_mildew):-
    not(disease(fusariumwilt)),
    not(disease(lentil)),
    not(disease(ascophytablight)),
    not(disease(anthracnose)),
    not(disease(root_rot_and_seedling_disease)),
    plant('gray-white areas covering entire plant',yes),
    plant('death of a plant',yes).

disease(collarrot):-
    not(disease(fusariumwilt)),
    not(disease(lentil)),
    not(disease(ascophytablight)),
    not(disease(anthracnose)),
    not(disease(root_rot_and_seedling_disease)),
    not(disease(powdery_mildew)),
    plant('chlorotic and wilted upper plant parts',yes),
    plant('necrotic plant',yes),
    plant('death of plant',yes),
    plant('white leisons on  stem',yes),
    plant('fluffy white growth on the stem',yes).

disease(pea_mosaic_virus):-
    not(disease(fusariumwilt)),
    not(disease(powderymildew)),
    not(disease(anthracnose)),
    not(disease(ascochytablight)),
    not(disease(root_rot_and_seedling_disease)),
    not(disease(lentil)),
    not(disease(collarrot)),
    plant('mosaic and chlorotic vein flecking',yes),
    plant('veinal enations',yes),plant('stunted growth of plant',yes),
    plant('molting of foliage',yes),
    plant('yellowing of leaves between the veins',yes),
    plant('proliferation of basal branches',yes),
    plant('splitting open of pods',yes),
    plant('prominent enations',yes),
    plant('yellowing of stipules',yes).
    
    
    
    output:-
    nl,
    possible_diseases.

    possible_diseases :- disease(X), write('the plant may suffer from '), write(X),nl.