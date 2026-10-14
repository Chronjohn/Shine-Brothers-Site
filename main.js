window.addEventListener('DOMContentLoaded', () => {
    // --- 1. SETUP ΣΚΗΝΗΣ ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 100, 0.1, 1000); 
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#canvas3d'),
        antialias: true,
        alpha: true 
    });

    renderer.setSize(window.innerWidth, 100);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const mainLight = new THREE.DirectionalLight(0xffffff, 3);
    mainLight.position.set(5, 10, 10);
    scene.add(mainLight);

    camera.position.z = 20;

    // --- 2. ΕΛΕΓΧΟΣ ΓΙΑ ΚΙΝΗΤΟ (RESPONSIVE SCALE) ---
    const isMobile = window.innerWidth < 768;
    const carScale = isMobile ? 350 : 600; 
    const travelDistance = isMobile ? 25 : 35;

    // --- 3. ΦΟΡΤΩΣΗ ΜΟΝΤΕΛΟΥ ---
    const loader = new THREE.GLTFLoader();
    let model;

    loader.load('models/polisher.glb', (gltf) => {
        model = gltf.scene;
        
        model.traverse((node) => {
            if (node.isMesh) {
                if (node.name.toLowerCase().includes("body") || node.name.toLowerCase().includes("car")) {
                    node.material.color.setHex(0xff0000);
                    node.material.metalness = 0.8;
                    node.material.roughness = 0.2;
                }
            }
        });

        model.scale.set(carScale, carScale, carScale); 
        model.position.set(-travelDistance, -4, 0);
        model.rotation.y = Math.PI / 2; 
        
        scene.add(model);

        // --- 4. GSAP SCROLL ANIMATION ---
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(model.position, {
            x: travelDistance, 
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });

        gsap.utils.toArray('.reveal').forEach(el => {
            gsap.to(el, {
                opacity: 1, 
                y: 0, 
                duration: 1,
                scrollTrigger: { trigger: el, start: "top 90%" }
            });
        });
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, 100);
        camera.aspect = window.innerWidth / 100;
        camera.updateProjectionMatrix();
    });

    // --- 5. MODAL LOGIC & DATA (ΕΜΠΛΟΥΤΙΣΜΕΝΑ ΚΕΙΜΕΝΑ) ---
    const serviceData = {
        headlights: { 
            title: "Ξεθάμπωμα / Γυάλισμα Φαναριών", 
            desc: `Τα φανάρια με την πάροδο του χρόνου οξειδώνονται από τον ήλιο, με αποτέλεσμα να κιτρινίζουν και να θαμπώνουν. Αυτό δεν είναι μόνο αισθητικό πρόβλημα, αλλά μειώνει δραματικά την ορατότητα και την ασφάλειά σας κατά τη νυχτερινή οδήγηση.<br><br>
                   <b>Η διαδικασία μας περιλαμβάνει:</b><br>
                   • <b>Πολυσταδιακή λείανση:</b> Χρήση εξειδικευμένων υγρών γυαλόχαρτων για την αφαίρεση της καμένης εξωτερικής στρώσης.<br>
                   • <b>Μηχανική διόρθωση:</b> Γυάλισμα με αλοιφαδόρο και αλοιφές υψηλής κοπής για την επαναφορά της διαύγειας.<br>
                   • <b>Σφράγιση & Προστασία:</b> Εφαρμογή ειδικού προστατευτικού UV sealer ή κεραμικής επίστρωσης για να διατηρηθεί το αποτέλεσμα κρυστάλλινο για μεγάλο χρονικό διάστημα.` 
        },
        full: { 
            title: "Εσωτερικό & Εξωτερικό", 
            desc: `Η ολοκληρωμένη φροντίδα που αξίζει το αυτοκίνητό σας. Συνδυάζουμε την premium εξωτερική εμφάνιση με μια πεντακάθαρη και υγιεινή καμπίνα.<br><br>
                   <b>Τι περιλαμβάνει αναλυτικά:</b><br>
                   • <b>Εξωτερικό:</b> Πλύσιμο με μέθοδο 2 κουβάδων για αποφυγή γρατζουνιών, καθαρισμός θόλων, λεπτομερής καθαρισμός ζαντών και περιποίηση ελαστικών με ειδικό conditioner.<br>
                   • <b>Εσωτερικό:</b> Σχολαστικό σκούπισμα σε κάθε γωνία, καθαρισμός και ενυδάτωση πλαστικών μερών, καθαρισμός τζαμιών χωρίς γραμμές και αρωματισμός που διαρκεί.` 
        },
        bio: { 
            title: "Βιολογικός Καθαρισμός", 
            desc: `Ένας βαθύς καθαρισμός που ξεπερνά το απλό σκούπισμα. Χρησιμοποιούμε εξειδικευμένα υποαλλεργικά προϊόντα και μηχανήματα extraction για να απομακρύνουμε ρύπους που έχουν εισχωρήσει βαθιά στις ίνες των υφασμάτων.<br><br>
                   <b>Πότε τον χρειάζεστε:</b><br>
                   • Για αφαίρεση επίμονων λεκέδων (καφές, λάδια, φαγητό).<br>
                   • Για την εξουδετέρωση δυσάρεστων οσμών (τσιγάρο, κατοικίδια).<br>
                   • Για την πλήρη απολύμανση από βακτήρια και ακάρεα, εξασφαλίζοντας ένα υγιεινό περιβάλλον για εσάς και την οικογένειά σας.` 
        },
        ceramic: { 
            title: "Διόρθωση / Γυάλισμα Χρώματος", 
            desc: `Η υπηρεσία που μεταμορφώνει την εμφάνιση του αυτοκινήτου σας. Η διόρθωση χρώματος (Paint Correction) αφαιρεί μόνιμα τις ατέλειες από το βερνίκι και επαναφέρει το βάθος του χρώματος.<br><br>
                   <b>Τι επιτυγχάνουμε:</b><br>
                   • <b>Αφαίρεση Swirl Marks:</b> Εξαφανίζουμε τις λεπτές γραμμές που μοιάζουν με ιστό αράχνης.<br>
                   • <b>Επαναφορά Λάμψης:</b> Το χρώμα αποκτά ξανά την αντανάκλαση καθρέφτη που είχε όταν ήταν καινούργιο.<br>
                   • <b>Αφαίρεση Οξείδωσης:</b> Διορθώνουμε τη θαμπάδα που προκαλείται από τον ήλιο και τα κακά πλυσίματα.` 
        },
        tints: { 
            title: "Αντιηλιακές Μεμβράνες", 
            desc: `Αναβαθμίστε την άνεση και την ασφάλεια του οχήματός σας με κορυφαίας ποιότητας αντιηλιακές μεμβράνες. <br><br>
                   <b>Γιατί να τοποθετήσετε μεμβράνες:</b><br>
                   • <b>Θερμική Προστασία:</b> Μειώνουν σημαντικά τη ζέστη στο εσωτερικό, κάνοντας τη χρήση του κλιματιστικού πιο αποδοτική.<br>
                   • <b>UV Shield:</b> Μπλοκάρουν το 99% της υπεριώδους ακτινοβολίας, προστατεύοντας το δέρμα σας και το σαλόνι από το "κάψιμο".<br>
                   • <b>Ιδιωτικότητα:</b> Προσφέρουν διακριτικότητα και προστατεύουν τα προσωπικά σας αντικείμενα από αδιάκριτα βλέμματα.` 
        },
        led: { 
            title: "Αναβάθμιση LED", 
            desc: `Εκσυγχρονίστε το σύστημα φωτισμού του αυτοκινήτου σας για μέγιστη ασφάλεια και στυλ. Τα συστήματα LED προσφέρουν πολύ πιο καθαρό και δυνατό φως σε σχέση με τις συμβατικές λάμπες αλογόνου.<br><br>
                   <b>Πλεονεκτήματα LED:</b><br>
                   • <b>Ακαριαίο άναμμα:</b> Μέγιστη απόδοση φωτισμού σε κλάσματα δευτερολέπτου.<br>
                   • <b>Μεγάλη Διάρκεια:</b> Αντέχουν έως και 50 φορές περισσότερο από τις απλές λάμπες.<br>
                   • <b>Αισθητική:</b> Δίνουν στο όχημα μια σύγχρονη και premium εμφάνιση με καθαρό λευκό φως.` 
        },
        nanoceramic: { 
            title: "Νανοκεραμική Προστασία", 
            desc: `Η νανοκεραμική επίστρωση (Ceramic Coating) είναι η απόλυτη ασπίδα προστασίας που μπορείτε να προσφέρετε στο αυτοκίνητό σας σήμερα. Δημιουργεί ένα ημι-μόνιμο στρώμα πάνω από το βερνίκι που λειτουργεί ως θώρακας.<br><br>
                   <b>Τα μοναδικά οφέλη:</b><br>
                   • <b>Ακραία Υδροφοβικότητα:</b> Το νερό και οι ρύποι απωθούνται αμέσως, διατηρώντας το αυτοκίνητο καθαρό για πολύ περισσότερο χρόνο.<br>
                   • <b>Χημική Αντοχή:</b> Προστατεύει από κουτσουλιές, ρετσίνια δέντρων και όξινη βροχή που καταστρέφουν το χρώμα.<br>
                   • <b>Εύκολο Πλύσιμο:</b> Η επιφάνεια γίνεται τόσο λεία που οι ρύποι αφαιρούνται με ελάχιστη προσπάθεια.` 
        }
    };

    // Ορισμός των συναρτήσεων στο window για να τις βρίσκει το onclick του HTML
    window.openService = (key) => {
        if (serviceData[key]) {
            document.getElementById('modalTitle').innerHTML = serviceData[key].title;
            document.getElementById('modalDescription').innerHTML = serviceData[key].desc;
            document.getElementById('serviceModal').style.display = "block";
            document.body.style.overflow = "hidden";
        }
    };

    window.closeService = () => {
        document.getElementById('serviceModal').style.display = "none";
        document.body.style.overflow = "auto";
    };

    window.openContactModal = () => {
        document.getElementById('contactModal').style.display = "block";
        document.body.style.overflow = "hidden";
    };

    window.closeContactModal = () => {
        document.getElementById('contactModal').style.display = "none";
        document.body.style.overflow = "auto";
    };

    window.onclick = (event) => {
        const sModal = document.getElementById('serviceModal');
        const cModal = document.getElementById('contactModal');
        if (event.target == sModal) window.closeService();
        if (event.target == cModal) window.closeContactModal();
    };
});