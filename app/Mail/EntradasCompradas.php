<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EntradasCompradas extends Mailable
{
    use Queueable, SerializesModels;

    public $compra;
    public $qrPaths;

    /**
     * Create a new message instance.
     *
     * @param \App\Models\Compra $compra
     * @param array $qrPaths
     */
    public function __construct($compra, $qrPaths)
    {
        $this->compra = $compra;
        $this->qrPaths = $qrPaths;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $email = $this->view('emails.entradas_compradas')
                      ->subject('Tus entradas han sido generadas')
                      ->with(['compra' => $this->compra]);

        // Adjuntar cada QR al correo
        foreach ($this->qrPaths as $qrPath) {
            $email->attach(storage_path("app/public/{$qrPath}"));
        }

        return $email;
    }
}
