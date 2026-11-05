"""Hugging Face Model Yayınlama ve Doğrulama Betiği (hf_deploy.py)

Bu betik, 'model/' dizinindeki artefaktları (model.onnx, config.json, README.md)
Hugging Face Hub'daki public model deposuna yükler ve commit hash'ini alır.

Kullanım:
    python hf_deploy.py --repo-id <hf_kullanici_adi>/se-primer-panic-onnx [--token <hf_token>]
"""
import argparse
import sys
from pathlib import Path
from huggingface_hub import HfApi, login

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent
MODEL_DIR = ROOT_DIR / "model"


def main():
    parser = argparse.ArgumentParser(description="Hugging Face Model Yayınlayıcı")
    parser.add_argument("--repo-id", required=True, help="HF Model Repo Kimliği (örn: mfatih-ergin/se-primer-panic-onnx)")
    parser.add_argument("--token", default=None, help="Hugging Face Write Token (isteğe bağlı)")
    args = parser.parse_args()

    if args.token:
        login(token=args.token)

    api = HfApi()

    print("=" * 70)
    print(f"📦 HUGGING FACE YAYINLAMA: {args.repo_id}")
    print("=" * 70)

    # Repoyu oluştur (varsa geçer)
    repo_url = api.create_repo(
        repo_id=args.repo_id,
        repo_type="model",
        private=False,
        exist_ok=True
    )
    print(f"✓ Model Reposu Hazır: {repo_url}")

    # Model klasörünü yükle
    commit_info = api.upload_folder(
        folder_path=str(MODEL_DIR),
        repo_id=args.repo_id,
        repo_type="model",
        commit_message="Release v2.0: Cognitive Overload & Panic Predictor ONNX Model"
    )

    commit_hash = commit_info.oid if hasattr(commit_info, "oid") else "main"
    print(f"\n✨ YÜKLEME TAMAMLANDI!")
    print(f"Commit Hash: {commit_hash}")
    print(f"Commit'e Sabitlenmiş Doğrudan İndirme URL'i:")
    print(f"👉 https://huggingface.co/{args.repo_id}/resolve/{commit_hash}/model.onnx")
    print("=" * 70)


if __name__ == "__main__":
    main()
