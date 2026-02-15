<?php

namespace App\Services;

use App\Models\EmailSetting;
use Illuminate\Support\Facades\Config;

class DynamicSmtpService
{
    /**
     * Read EmailSettings from the database and configure Laravel's mailer at runtime.
     *
     * @return bool True if settings were applied, false if no settings exist.
     */
    public function configure(): bool
    {
        $settings = EmailSetting::first();

        if (!$settings) {
            return false;
        }

        Config::set('mail.default', 'smtp');
        Config::set('mail.mailers.smtp.host', $settings->smtp_host);
        Config::set('mail.mailers.smtp.port', $settings->smtp_port);
        Config::set('mail.mailers.smtp.username', $settings->smtp_username);
        Config::set('mail.mailers.smtp.password', $settings->smtp_password);
        Config::set('mail.mailers.smtp.encryption', $settings->encryption === 'none' ? null : $settings->encryption);
        Config::set('mail.from.address', $settings->from_address);
        Config::set('mail.from.name', $settings->from_name);

        return true;
    }
}
