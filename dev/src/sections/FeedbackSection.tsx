import { useState } from "react";
import { Button } from "../../../components/Button";
import { Spinner } from "../../../components/Spinner";
import { useToast } from "../../../components/Toast";
import { Modal } from "../../../components/Modal";
import { BottomSheet } from "../../../components/BottomSheet";
import { Card, Row } from "./Layout";

export function FeedbackSection() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card title="Spinner">
        <Row>
          <Spinner variant="ring" />
          <Spinner variant="dots" />
          <Spinner variant="pulse" />
          <Spinner variant="bars" />
        </Row>
      </Card>

      <Card title="Toast (useToast)">
        <Row>
          <Button
            variant="success"
            onClick={() => toast({ title: "Guardado", description: "Los cambios se guardaron.", variant: "success" })}
          >
            Success
          </Button>
          <Button
            variant="danger"
            onClick={() => toast({ title: "Error al guardar", variant: "error" })}
          >
            Error
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast({
                title: "Nueva versión disponible",
                variant: "info",
                action: { label: "Actualizar", onClick: () => toast({ title: "Actualizando…" }) },
              })
            }
          >
            Con acción
          </Button>
        </Row>
      </Card>

      <Card title="Modal">
        <Button onClick={() => setModalOpen(true)}>Abrir modal</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirmar acción"
          description="Esto no se puede deshacer."
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button variant="danger" onClick={() => setModalOpen(false)}>Eliminar</Button>
            </>
          }
        >
          <p className="text-sm text-muted">Contenido del modal.</p>
        </Modal>
      </Card>

      <Card title="BottomSheet">
        <Button onClick={() => setSheetOpen(true)}>Abrir sheet</Button>
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          size="md"
          title="Elegí una opción"
          footer={<Button fullWidth onClick={() => setSheetOpen(false)}>Confirmar</Button>}
        >
          <p className="text-sm text-muted">Contenido del sheet.</p>
        </BottomSheet>
      </Card>
    </div>
  );
}
