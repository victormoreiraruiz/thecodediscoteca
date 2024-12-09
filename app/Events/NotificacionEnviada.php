<?php
namespace App\Events;

use App\Models\Notificacion;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NotificacionEnviada implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $notificacion;

    public function __construct(Notificacion $notificacion)
    {
        $this->notificacion = $notificacion;
    }

    public function broadcastOn()
    {
        return new Channel('notificaciones.' . $this->notificacion->usuario_id);
    }
}
