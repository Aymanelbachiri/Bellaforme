<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Nouveau message de contact</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e5e5; padding-bottom: 10px;">
        Nouveau message de contact
    </h2>

    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
            <td style="padding: 8px 12px; font-weight: bold; width: 200px; vertical-align: top;">Nom & prénom</td>
            <td style="padding: 8px 12px;">{{ $contactMessage->name }}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">E-mail</td>
            <td style="padding: 8px 12px;">{{ $contactMessage->email }}</td>
        </tr>
        @if($contactMessage->phone)
        <tr>
            <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Téléphone</td>
            <td style="padding: 8px 12px;">{{ $contactMessage->phone }}</td>
        </tr>
        @endif
        @if($contactMessage->city)
        <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Ville</td>
            <td style="padding: 8px 12px;">{{ $contactMessage->city }}</td>
        </tr>
        @endif
        @if($contactMessage->activity_type)
        <tr>
            <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Type d'activité</td>
            <td style="padding: 8px 12px;">{{ $contactMessage->activity_type }}</td>
        </tr>
        @endif
        @if($contactMessage->project_nature)
        <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Nature du projet</td>
            <td style="padding: 8px 12px;">{{ $contactMessage->project_nature }}</td>
        </tr>
        @endif
        @if($contactMessage->equipment_timeline)
        <tr>
            <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Délai d'équipement</td>
            <td style="padding: 8px 12px;">{{ $contactMessage->equipment_timeline }}</td>
        </tr>
        @endif
        @if($contactMessage->request_reason)
        <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Motif de la demande</td>
            <td style="padding: 8px 12px;">{{ $contactMessage->request_reason }}</td>
        </tr>
        @endif
    </table>

    <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #333;">
        <strong>Message :</strong>
        <p style="margin-top: 8px; white-space: pre-wrap;">{{ $contactMessage->message }}</p>
    </div>

    @if($contactMessage->product)
    <p style="margin-top: 15px; font-size: 0.9em; color: #666;">
        Produit associé : <strong>{{ $contactMessage->product->name }}</strong>
    </p>
    @endif
</body>
</html>
