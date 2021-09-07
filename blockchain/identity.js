/**
 * identity of an person
 */


class Identity {
    names
    surnames
    birthDate
    birthPlace
    sexe
    height
    proffession
    signature
    father
    mother
    SM
    address
    issueDate
    expiryDate
    identificationPost
    picture
    digitalFinger
    identifiant

    constructor(names, surnames, birthDate, birthPlace, sexe, height, proffession, signature, father, mother, SM, address, issueDate, expiryDate, identificationPost, picture, digitalFinger, identifiant) {
        this.names=names
        this.surnames=surnames
        this.birthDate=birthDate
        this.birthPlace=birthPlace
        this.sexe=sexe
        this.height=height
        this.proffession=proffession
        this.signature=signature
        this.father=father
        this.mother=mother
        this.SM=SM
        this.address=address
        this.issueDate=issueDate
        this.expiryDate=expiryDate
        this.identificationPost=identificationPost
        this.picture=picture
        this.digitalFinger=digitalFinger
        this.identifiant=identifiant
    }

}
// let pascal=new Identity("pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal")




exports.Identity=Identity