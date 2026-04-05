import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { SeoData } from '@/types/models';

export default function ConditionsDeVente({ seo }: { seo: SeoData }) {
    return (
        <PublicLayout>
            <SeoHead {...seo} />
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                <h1
                    className="mb-10 text-center text-2xl font-black uppercase text-white sm:text-3xl"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    Conditions de vente
                </h1>

                <div className="space-y-8 text-sm leading-relaxed text-white/90 sm:text-base" style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif" }}>
                    <p>
                        Ces conditions g&eacute;n&eacute;rales de vente sont ordonn&eacute;es par les directives g&eacute;n&eacute;rales du groupe, elles ne peuvent pas subir de changement dans leur contenu sans l'approbation de l'assembl&eacute; g&eacute;n&eacute;rale.
                    </p>

                    <Section title="1- Objet et Validit&eacute; des Offres">
                        <p>
                            Nos offres concernant tous les &eacute;quipements, produits et services explicitement mentionn&eacute;es sur nos bons de commande sign&eacute;s et valid&eacute;s par la direction de la soci&eacute;t&eacute; Bella Forme.
                        </p>
                        <p>
                            Tout produit ou service non mentionn&eacute; et non factur&eacute; par la soci&eacute;t&eacute; Bella Forme, ne peut repr&eacute;senter un engagement de la soci&eacute;t&eacute; Bella Forme envers le client. Les commandes qui nous sont remises directement o&ugrave; recueillies par nos repr&eacute;sentants ne peuvent nous engager qu'apr&egrave;s validation de la direction l&eacute;gale de la soci&eacute;t&eacute;.
                        </p>
                    </Section>

                    <Section title="2- Conditions de r&egrave;glement">
                        <p>
                            Sauf modalit&eacute;s et mentions sp&eacute;ciales stipul&eacute;es sur le bon de commande et confirm&eacute;es par la signature l&eacute;gale et cachet de la soci&eacute;t&eacute; Bella Forme, le mode de r&egrave;glement en g&eacute;n&eacute;rale est comme suit :
                        </p>
                        <ul className="list-disc space-y-1 pl-6">
                            <li>1&egrave;re partie d'acompte &agrave; la commande : 50%</li>
                            <li>2&egrave;me partie d&egrave;s r&eacute;ception par le client d'avis d'arriv&eacute;e de sa commande ou la mise &agrave; disposition de sa commande dans nos entrep&ocirc;ts : 30%</li>
                            <li>3&egrave;me partie &agrave; la livraison du client (avant installation et mise en marche) : 20%</li>
                        </ul>
                        <p>
                            Le client s'engage d&egrave;s avis de r&eacute;ception, ou de mise &agrave; disposition dans nos magasins de la totalit&eacute; ou d'une partie de sa commande &agrave; r&eacute;gler cette partie proportionnellement au pourcentage du mode de r&egrave;glement convenu.
                        </p>
                        <p>
                            Si le client ne peut prendre possession d'une partie ou de la totalit&eacute; des articles command&eacute;s pour quelques raisons que ce soit (chantier ou local non termin&eacute;, absence de personnes, probl&egrave;me autorisation, autres...) il s'engage &agrave; r&eacute;gler selon les modalit&eacute;s convenues d&egrave;s avis au client par la Soci&eacute;t&eacute; Bella Forme de la mise &agrave; disposition des articles command&eacute;s dans nos locaux et cela sans retard ou contestation aucune.
                        </p>
                        <p>
                            En cas de non enl&egrave;vement de la commande par le client dans un d&eacute;lai de 15 jours apr&egrave;s cet avis, nous serions contraints d'appliquer tout changement des conditions de vente ou en droit de disposer du mat&eacute;riel ou produits concern&eacute;s.
                        </p>
                        <p>
                            Les acomptes re&ccedil;us &agrave; titre de commande ne sont pas remboursables mais utilisables pour l'achat d'autres produits apr&egrave;s accord de la soci&eacute;t&eacute; dans un d&eacute;lai maximum d'un an &agrave; partir de la date de r&eacute;ception de l'acompte.
                        </p>
                        <p>
                            &Agrave; convenir d'un commun accord qui doit &ecirc;tre pr&eacute;cis&eacute; sur le bon de commande.
                        </p>
                    </Section>

                    <Section title="3- D&eacute;lai de Livraison">
                        <p>
                            Ce d&eacute;lai mentionn&eacute; sur le Bon de Commande est &agrave; titre indicatif (jour ouvrable) et non contractuel. Il d&eacute;pend de plusieurs al&eacute;as ind&eacute;pendants de notre volont&eacute; (d&eacute;lai de production du fabricant, transport international, formalit&eacute; douani&egrave;re, enregistrement aupr&egrave;s de services des tutelles...).
                        </p>
                    </Section>

                    <Section title="4- Stockage de marchandises">
                        <p>
                            La soci&eacute;t&eacute; assure le stockage de votre marchandise jusqu'&agrave; 15 jours apr&egrave;s son arrivage. Au-del&agrave; de ce d&eacute;lai, des frais de stockage seront factur&eacute;s en sus &agrave; raison de 10 Dhs / m3 / jour. Cette possibilit&eacute; de stockage ne sera propos&eacute;e que dans la limit&eacute; de la disponibilit&eacute; de l'espace dans nos entrep&ocirc;ts s&eacute;curis&eacute;s. Dans le cas contraire, le client se doit de trouver un lieu de stockage ind&eacute;pendant et &agrave; sa charge.
                        </p>
                    </Section>

                    <Section title="5- Livraison, d&eacute;chargement, accessibilit&eacute;, installation">
                        <p>
                            Notre service technique vous contactera pour prendre rendez-vous et d&eacute;terminer avec vous les points cit&eacute;s ci-dessus :
                        </p>
                        <p>
                            <strong>Livraison :</strong> cas de livraison assur&eacute;e par nos soins, notre service logistique prendra contact avec le client pour convenir selon son planning d'une date de livraison. Cette date doit &ecirc;tre valid&eacute;e par le client par mail, WhatsApp ou SMS.
                        </p>
                        <p>
                            <strong>D&eacute;chargement et manutention &agrave; l'int&eacute;rieur du site :</strong> il est &agrave; la charge et sous la responsabilit&eacute; du client. Ce dernier doit mettre &agrave; disposition du personnel dont l'effectif peut varier en fonction de la nature de l'&eacute;quipement (poids et volume) du projet. En cas de n&eacute;cessit&eacute;, le client doit pr&eacute;voir &eacute;galement un chariot &eacute;l&eacute;vateur.
                        </p>
                        <p>
                            <strong>Accessibilit&eacute; des locaux :</strong> le client doit fournir &agrave; la soci&eacute;t&eacute; les plans am&eacute;nagement contenant les dimensions des acc&egrave;s (porte principale, porte des pi&egrave;ces contenant des &eacute;quipements, largeur des couloirs et des escaliers, ascenseur). De fa&ccedil;on g&eacute;n&eacute;rale, toutes les dimensions des acc&egrave;s indispensables &agrave; l'acheminement de votre &eacute;quipement.
                        </p>
                        <p>
                            <strong>Installation plomberie et &eacute;lectricit&eacute; :</strong> Les installations n&eacute;cessitant un raccordement &agrave; l'eau doivent faire l'objet d'une intervention d'un plombier ou/et &eacute;lectricien mandat&eacute; par vos soins. Pr&eacute;alablement &agrave; toute installation, les attentes d'eau et des &eacute;vacuations ainsi que les points de branchements &eacute;lectriques doivent &ecirc;tre valid&eacute;s avec notre service technique. La pr&eacute;sence de votre plombier et/ou &eacute;lectricien est indispensable le jour de notre intervention. En fonction de la sp&eacute;cificit&eacute; de votre &eacute;quipement, des raccordements seront &agrave; pr&eacute;voir. L'&eacute;lectricien doit pr&eacute;voir une section c&acirc;ble &eacute;lectrique de 2.5mm et laisser &agrave; notre disposition une longueur de c&acirc;ble de 1.5m par prise &agrave; exploiter pour un branchement direct.
                        </p>
                    </Section>

                    <Section title="6- Retour de mat&eacute;riel">
                        <p>
                            Les appareils command&eacute;s sont nominatifs. Aucun retour ou &eacute;change ne sera accept&eacute;.
                        </p>
                    </Section>

                    <Section title="7- Formation">
                        <p>
                            La formation se tient exclusivement dans notre centre de formation sur RDV. Une fiche de renseignement vous sera transmise dans le but d'&eacute;valuer le niveau de vos collaborateurs afin de vous apporter un module de formation adapt&eacute;.
                        </p>
                        <p>
                            Des formations compl&eacute;mentaires pourront vous &ecirc;tre propos&eacute;es ou dispens&eacute;es (sur devis) pour des modules pr&eacute;cis par des formateurs en interne ou externe selon un planning &agrave; d&eacute;finir.
                        </p>
                    </Section>

                    <Section title="8- Garantie">
                        <p>
                            Tout notre mat&eacute;riel est garanti contre tout vice de construction selon la dur&eacute;e stipul&eacute;e par le constructeur, et concerne le remplacement de toutes les pi&egrave;ces reconnues par nos services comme &eacute;tant des pi&egrave;ces d&eacute;fectueuses et couverts par les termes de la garantie.
                        </p>
                        <p>
                            Cette garantie &eacute;tant une garantie retour atelier. La r&eacute;paration et la fourniture de ces pi&egrave;ces s'entend dans notre atelier &agrave; Casablanca, les frais d'acheminement et d&eacute;placement pour diagnostic ou r&eacute;paration demeurant &agrave; la charge du client qui s'y oblige.
                        </p>
                        <p>
                            Les frais de main d'oeuvre pendant la p&eacute;riode de garantie &eacute;tant &agrave; la charge de la soci&eacute;t&eacute;. Toute intervention dans le cadre de la garantie, ne peuvent avoir pour effet de prolonger le d&eacute;lai de celle-ci, ni d'entra&icirc;ner le paiement d'indemnit&eacute;s pour arr&ecirc;t ou d&eacute;g&acirc;t quelconques.
                        </p>
                        <p>
                            Notre garantie ne saurait nous engager en cas de d&eacute;faut de surveillance ou d'entretien ainsi qu'en cas de n&eacute;gligence ou d'utilisation d&eacute;fectueuse des installations.
                        </p>
                        <p>
                            Nos conditions de garantie ne sont valables que lorsque notre client a rempli ses engagements de r&egrave;glements de sa commande en totalit&eacute;.
                        </p>
                    </Section>

                    <Section title="9- Entretien">
                        <p>
                            L'Acheteur s'engage &agrave; entretenir convenablement le mat&eacute;riel fourni et &agrave; respecter les consignes de marche qui lui seront communiqu&eacute;es. A d&eacute;faut, notre responsabilit&eacute; ne saurait &ecirc;tre mise en cause, et la garantie ci-dessus pr&eacute;vue ne pourrait &ecirc;tre invoqu&eacute;e.
                        </p>
                    </Section>

                    <Section title="10- Droits de propri&eacute;t&eacute;">
                        <p>
                            L'ensemble des &eacute;quipements et produits reste la propri&eacute;t&eacute; de la soci&eacute;t&eacute; jusqu'&agrave; remise par la soci&eacute;t&eacute; au client d'une facture d&eacute;finitive sign&eacute;e et cachet&eacute;e mentionnant le r&egrave;glement et l'encaissement de la totalit&eacute; du montant de la facture objet de la commande.
                        </p>
                    </Section>

                    <p className="mt-10 text-center text-sm italic text-white/60">
                        * En cas de litige, seul le tribunal de commerce de CASABLANCA est habilit&eacute; &agrave; statuer entre les deux parties.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h2 className="text-base font-bold text-[#d5ab70] sm:text-lg">{title}</h2>
            {children}
        </div>
    );
}
