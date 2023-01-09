$fn=200;

module roundedbox(lg,wd,ht,rd) {
    hull() {
        translate([-lg/2+rd,-wd/2+rd,0]) cylinder(ht,rd,rd);
        translate([ lg/2-rd,-wd/2+rd,0]) cylinder(ht,rd,rd);
        translate([-lg/2+rd, wd/2-rd,0]) cylinder(ht,rd,rd);
        translate([ lg/2-rd, wd/2-rd,0]) cylinder(ht,rd,rd);
    }
}

module screew() {
    difference() {
        cylinder(27,4,4);
        translate([0,0,20]) cylinder(12,0,2);
    } 
    
}

module openroundedbox(lg,wd,ht,rd,th,in) {
    difference() {
        roundedbox(lg,wd,ht,rd);
        translate([0,0,th]) roundedbox(lg-2*th,wd-2*th,ht,rd);
        if(in) {
            translate([0,0,ht-th]) roundedbox(lg-th+0.5,wd-th+0.5,ht,rd);
        }
        else {
            difference() {
                translate([0,0,ht-th]) roundedbox(lg+1,wd+1,th+1,rd);
                translate([0,0,th]) roundedbox(lg-th,wd-th,ht,rd);
            }
        }
    }
}

difference() {
    openroundedbox(110,70,30,5,3,true);
    translate([-43,20,15]) cube([70,20,20]);
    translate([25,0,-1]) cylinder(6,0,5);;
    translate([-25,0,-1]) cylinder(6,0,5);;
}
translate([-5,2,3]) difference() {
    union() {
        translate([-35,-25,5]) cube([6,6,10],center=true);
        translate([ 35,-25,5]) cube([6,6,10],center=true);
        translate([-35, 25,5]) cube([6,6,10],center=true);
        translate([ 35, 25,5]) cube([6,6,10],center=true);
    }
    translate([-36,-26,8]) cube([72,52,20]);
}

translate([-49,-29,0]) screew();
translate([49,29,0]) screew();
 
translate([0,80,0]) difference() {
    openroundedbox(110,70,8,5,3,false);
    translate([-49,29,-1]) cylinder(5,4,1);
    translate([49,-29,-1]) cylinder(5,4,1);;

    for(i=[-30:10:30])
        for(j=[-20:10:20])
            translate([i,j,-1]) cube([5,5,20],center=true);
}