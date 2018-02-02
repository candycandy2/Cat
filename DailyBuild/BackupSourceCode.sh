# ====== backup source code ======

# --- mount datastore server ---
mount_smbfs //'domain;id:pw'@datastore/BI30/QPlay/6.SourceCode ~/SourceCode 

datestring=$(date +"%Y_%m_%d")
zipFileName=QPlayDailyBuild_$datestring.zip

# --- zip source code ---
zip -r $zipFileName .

# --- copy zip to datastore server ---
cp $zipFileName ~/SourceCode
#rm $zipFileName

# --- delete the oldest zip ---
while [ $(ls -l ~/SourceCode/*.zip | wc -l) -gt 10 ]; do
    echo "delete the oldest backup"
    oldestbackup=$(ls -rt ~/SourceCode/*.zip | head -1)
    rm $oldestbackup
done

# --- unmount datastore server ---
umount ~/SourceCode
