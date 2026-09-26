<script setup>
import { ref, onMounted, computed } from 'vue';
import { PhUserPlus, PhUsers, PhShieldCheck, PhPhone, PhTrash } from '@phosphor-icons/vue';
import { listMembers, addMember } from '../../../services/exploitation_service.js';
import { useExploitation } from '../../../composables/useExploitation.js';

const { getActiveExploitation } = useExploitation();
const members = ref([]);
const loading = ref(true);
const showInviteModal = ref(false);

// Invite form
const inviteNom = ref('');
const inviteTel = ref('');
const inviteRole = ref('EMPLOYE');
const inviteLoading = ref(false);
const inviteError = ref('');
const inviteSuccess = ref(false);
const generatedPin = ref('');
const createdMember = ref(null);

const exploitationId = computed(() => getActiveExploitation());

onMounted(async () => {
  await fetchMembers();
});

async function fetchMembers() {
  const expId = exploitationId.value;
  if (!expId) return;
  try {
    loading.value = true;
    members.value = await listMembers(expId);
  } catch (err) {
    console.error('Erreur chargement équipe', err);
  } finally {
    loading.value = false;
  }
}

async function handleInvite() {
  if (!inviteTel.value || inviteTel.value.length < 9) {
    inviteError.value = 'Numéro de téléphone invalide.';
    return;
  }
  inviteError.value = '';
  inviteLoading.value = true;
  try {
    const formattedPhone = inviteTel.value.startsWith('+') ? inviteTel.value : '+221' + inviteTel.value.replace(/^0+/, '').replace(/\s+/g, '');
    
    const response = await addMember(exploitationId.value, {
      telephone: formattedPhone,
      nomComplet: inviteNom.value || 'Ouvrier',
      role: inviteRole.value,
    });
    
    generatedPin.value = response.codePin;
    createdMember.value = response;
    inviteSuccess.value = true;
    
    await fetchMembers();
  } catch (err) {
    inviteError.value = err.response?.data?.message || 'Erreur lors de l\'invitation.';
  } finally {
    inviteLoading.value = false;
  }
}

function getWhatsAppLink() {
  const tel = createdMember.value?.telephone?.replace(/\D/g, '') || '';
  const url = window.location.origin + '/worker/login';
  const text = encodeURIComponent(
    `Bonjour ${createdMember.value?.prenom || 'Moussa'},\n\nVoici l'application pour la ferme.\nClique sur ce lien pour te connecter : ${url}\n\nTon code secret est : ${generatedPin.value}`
  );
  return `https://wa.me/${tel}?text=${text}`;
}

function getRoleBadgeClass(role) {
  if (role === 'PROPRIETAIRE') return 'badge-owner';
  if (role === 'GERANT') return 'badge-manager';
  return 'badge-worker';
}

function getRoleLabel(role) {
  if (role === 'PROPRIETAIRE') return 'Propriétaire';
  if (role === 'GERANT') return 'Gérant';
  return 'Ouvrier';
}

function closeModal() {
  showInviteModal.value = false;
  inviteError.value = '';
  inviteSuccess.value = false;
  inviteNom.value = '';
  inviteTel.value = '';
  generatedPin.value = '';
  createdMember.value = null;
}
</script>

<template>
  <div class="team-page animate-fade-in">
    <!-- Header -->
    <section class="team-header">
      <div class="team-header-left">
        <h1 class="team-title">Équipe</h1>
        <p class="team-subtitle">
          Gérez les accès de votre exploitation. Invitez vos gérants et ouvriers en quelques secondes.
        </p>
      </div>
      <button class="invite-btn" @click="showInviteModal = true">
        <PhUserPlus :size="18" weight="bold" />
        Inviter un membre
      </button>
    </section>

    <!-- Members List -->
    <section class="team-section">
      <div class="team-section-header">
        <span class="section-num">01</span>
        <span class="section-sep">—</span>
        <span class="section-title-text">MEMBRES</span>
        <span class="member-count">{{ members.length }}</span>
      </div>

      <div v-if="loading" class="team-loading">Chargement de l'équipe…</div>

      <div v-else-if="members.length === 0" class="team-empty">
        <PhUsers :size="48" weight="duotone" color="var(--accent-warm)" />
        <h3>Aucun membre pour le moment</h3>
        <p>Invitez votre premier ouvrier ou gérant pour commencer.</p>
      </div>

      <div v-else class="members-grid">
        <div v-for="member in members" :key="member.membershipId" class="member-card">
          <div class="member-avatar">
            {{ (member.prenom || 'M').charAt(0) }}{{ (member.nom || 'I').charAt(0) }}
          </div>
          <div class="member-info">
            <h4 class="member-name">{{ member.prenom }} {{ member.nom }}</h4>
            <p class="member-phone">
              <PhPhone :size="14" weight="regular" />
              {{ member.telephone }}
            </p>
          </div>
          <span class="role-badge" :class="getRoleBadgeClass(member.role)">
            <PhShieldCheck v-if="member.role === 'PROPRIETAIRE'" :size="14" weight="fill" />
            {{ getRoleLabel(member.role) }}
          </span>
        </div>
      </div>
    </section>

    <!-- Invite Modal -->
    <div v-if="showInviteModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">Inviter un membre</h2>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <div v-if="inviteSuccess" class="invite-success">
          <span class="success-check">✓</span>
          <p class="success-title">Compte créé avec succès !</p>
          <div class="pin-box">
            <span class="pin-label">Code Secret (PIN) :</span>
            <strong class="pin-code">{{ generatedPin }}</strong>
          </div>
          
          <a :href="getWhatsAppLink()" target="_blank" class="whatsapp-btn">
            Partager sur WhatsApp
          </a>
        </div>

        <form v-else @submit.prevent="handleInvite" class="invite-form">
          <p class="invite-desc">
            Renseignez le numéro de téléphone du membre. S'il n'a pas encore de compte, il sera automatiquement créé lors de sa première connexion.
          </p>

          <div class="form-group">
            <label class="form-label">Nom Complet</label>
            <input
              v-model="inviteNom"
              type="text"
              class="form-input"
              placeholder="ex: Moussa DIOP"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Numéro de téléphone</label>
            <input
              v-model="inviteTel"
              type="tel"
              class="form-input"
              placeholder="+221 77 123 45 67"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Rôle</label>
            <div class="role-selector">
              <button
                type="button"
                class="role-option"
                :class="{ active: inviteRole === 'EMPLOYE' }"
                @click="inviteRole = 'EMPLOYE'"
              >
                <strong>Ouvrier</strong>
                <span>Saisie de traites, consultation</span>
              </button>
              <button
                type="button"
                class="role-option"
                :class="{ active: inviteRole === 'GERANT' }"
                @click="inviteRole = 'GERANT'"
              >
                <strong>Gérant</strong>
                <span>Gestion complète du terrain</span>
              </button>
            </div>
          </div>

          <p v-if="inviteError" class="form-error">{{ inviteError }}</p>

          <button type="submit" class="submit-btn" :disabled="inviteLoading">
            {{ inviteLoading ? 'Envoi…' : 'Envoyer l\'invitation' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-page {
  padding: 0;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 40px;
}

.team-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 6px;
}

.team-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
  max-width: 480px;
}

.invite-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.invite-btn:hover {
  background: var(--accent-warm-hover, #B5642A);
}

/* Section */
.team-section { margin-bottom: 32px; }

.team-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.section-num {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-warm);
  letter-spacing: 0.05em;
}
.section-sep {
  color: var(--border-medium);
  font-size: 14px;
}
.section-title-text {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}
.member-count {
  background: var(--accent-warm);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  margin-left: 4px;
}

.team-loading {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-size: 14px;
}

.team-empty {
  text-align: center;
  padding: 60px 24px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
}
.team-empty h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 16px 0 8px;
}
.team-empty p {
  font-size: 14px;
  color: var(--text-muted);
}

/* Members Grid */
.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.member-card:hover {
  border-color: var(--border-medium);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.member-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent-warm);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 2px;
}

.member-phone {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-muted);
}

.role-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 5px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.badge-owner {
  background: #FEF3C7;
  color: #92400E;
}
.badge-manager {
  background: #DBEAFE;
  color: #1E40AF;
}
.badge-worker {
  background: #F3F4F6;
  color: #374151;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-container {
  background: var(--bg-app, #FAF8F5);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 460px;
  padding: 28px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-dark);
}

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
}

.invite-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border-medium, #D1D5DB);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-family: inherit;
  background: #fff;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.form-input:focus {
  outline: none;
  border-color: var(--accent-warm);
  box-shadow: 0 0 0 3px rgba(200, 117, 51, 0.12);
}

.role-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.role-option {
  background: #fff;
  border: 2px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.role-option strong {
  display: block;
  font-size: 14px;
  color: var(--text-dark);
  margin-bottom: 4px;
}
.role-option span {
  font-size: 12px;
  color: var(--text-muted);
}
.role-option.active {
  border-color: var(--accent-warm);
  background: rgba(200, 117, 51, 0.04);
}

.form-error {
  color: #DC2626;
  font-size: 13px;
  margin-bottom: 16px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: var(--accent-warm);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}
.submit-btn:hover:not(:disabled) {
  background: var(--accent-warm-hover, #B5642A);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.invite-success {
  text-align: center;
  padding: 32px 0;
}
.success-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #D1FAE5;
  color: #059669;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}
.invite-success p.success-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 24px;
}

.pin-box {
  background-color: #F3F4F6;
  border: 1px dashed var(--border-medium);
  padding: 16px;
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.pin-label {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
}

.pin-code {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--text-dark);
}

.whatsapp-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  background-color: #25D366; /* WhatsApp Green */
  color: white;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  transition: background 0.2s;
  box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);
}

.whatsapp-btn:hover {
  background-color: #1EBE5C;
}

@media (max-width: 768px) {
  .team-header {
    flex-direction: column;
    align-items: stretch;
  }
  .members-grid {
    grid-template-columns: 1fr;
  }
}
</style>
